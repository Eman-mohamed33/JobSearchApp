import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { OtpRepository } from 'src/DB';
import { ConfirmEmailBodyDto, LoginBodyDto, ResendConfirmEmailOtp, ResetPasswordBodyDto, SignupBodyDto, VerifyGmail } from './dto/auth.dto';
import { Types } from 'mongoose';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { compareHash, generateHash, ProviderEnum, TypeEnum } from 'src/common';
import { generateOtp } from 'src/common/utils/otp';
import { emailEvent } from 'src/common/utils/events/email.event';
import { loginCredentials } from './entities/auth.entity';
import { TokenService } from 'src/common/services/token.service';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { UserDocument } from 'src/DB/models/user.model';

@Injectable()
export class AuthenticationService {
  private async verifyGmailAccount(idToken: string): Promise<TokenPayload> {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_IDs?.split(',') || [],
    });
    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
      throw new BadRequestException('Fail to verify this google Account');
    }
    return payload;
  }
  private async createConfirmEmailOtp(userId: Types.ObjectId,otp:string) {
    await this.otpRepository.create({
      data: [
        {
          code: await generateHash(otp),
          createdBy: userId,
          type: TypeEnum.ConfirmEmail,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000),
        },
      ],
    });
  }
  constructor(private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly tokenService: TokenService,
  ) { }
  
  async signup(body:SignupBodyDto):Promise<string> {
    const { firstName, lastName, password, email, gender, DOB, role, mobileNumber } = body;
    const checkUserExist = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkUserExist) {
      throw new ConflictException('User already exist');
    }

    const [user] = await this.userRepository.create({
      data: [
        {
          firstName,
          lastName,
          password,
          email,
          gender,
          DOB,
          role,
          mobileNumber,
          provider: ProviderEnum.System,
          isConfirmed: false,
        },
      ],
    });
    if (!user) {
      throw new BadRequestException('Fail to signup this account');
    }
    const otp = String(generateOtp());
    await this.createConfirmEmailOtp(user._id, otp);
    emailEvent.emit(TypeEnum.ConfirmEmail, { to: email, otp });
    return 'Done';
  }

  async login(body: LoginBodyDto): Promise<loginCredentials> {
    const { email, password } = body;
    const userExist = await this.userRepository.findOne({
      filter: { email },
    });

    if (!userExist) {
      throw new NotFoundException('fail to find matching account');
    }

    if (!userExist.isConfirmed) {
      throw new BadRequestException('please verify your account first');
    }

    if (!(await compareHash(password, userExist.password))) {
      throw new BadRequestException('invalid login data');
    }

    const credentials = await this.tokenService.createLoginCredentials(
      userExist as UserDocument,
    );
    return { credentials }; 
  }

  async signupWithGmail(body: VerifyGmail): Promise<string> {
    const { idToken } = body;
    const { email, family_name, given_name } =
      await this.verifyGmailAccount(idToken);
    const checkUserExist = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkUserExist) {
      if (checkUserExist.provider === ProviderEnum.Google) {
        await this.loginWithGmail(body);
      }
      throw new ConflictException('User already Exist');
    }

    const user = await this.userRepository.create({
      data: [
        {
          firstName: given_name as string,
          lastName: family_name as string,
          email: email as string,
          isConfirmed: true,
          provider: ProviderEnum.Google,
        },
      ],
    });

    if (!user) {
      throw new BadRequestException(
        'Fail to signup with gmail please try again...',
      );
    }
    return 'Done';
  }

  async loginWithGmail(body: VerifyGmail): Promise<loginCredentials> {
    const { idToken } = body;
    const { email } = await this.verifyGmailAccount(idToken);
    const user = await this.userRepository.findOne({
      filter: { email, provider: ProviderEnum.Google },
    });
    if (!user) {
      throw new NotFoundException('User Not Exist');
    }
    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );
    return { credentials }; 
  }

  async confirmEmail(body: ConfirmEmailBodyDto): Promise<string> {
    const { email, otp } = body;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        isConfirmed: false,
      },
      options: {
        populate: [{ path: 'otp', match: { type: TypeEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException('user not exist or already email confirmed');
    }
    const checkOtp = await this.otpRepository.findOne({
      filter: {
        createdBy: user._id,
        type: TypeEnum.ConfirmEmail,
      }
    });

    if (!checkOtp || !await compareHash(String(otp), checkOtp?.code )) {
      throw new BadRequestException('invalid otp');
    }

    if ((checkOtp?.expiresIn.getTime() ?? 0) < Date.now()) {
      await this.otpRepository.deleteOne({ filter: { type: TypeEnum.ConfirmEmail, createdBy: user._id } });
      throw new BadRequestException("Code expired ,You need to request a new one");
    }
    
    user.isConfirmed = true;
    await user.save();

    await this.otpRepository.deleteOne({ filter: { createdBy: user._id } });
    return 'Done';
  }

  async resendConfirmEmailOtp(body:ResendConfirmEmailOtp) {
    const { email } = body;
    const user = await this.userRepository.findOne({
      filter: { email, isConfirmed: false },
    });
    if (!user) {
      throw new NotFoundException('fail to find matching result');
    }

    const checkOtp = await this.otpRepository.findOne({
      filter: {
        createdBy: user._id,
        type: TypeEnum.ConfirmEmail,
      }
    });

    if (checkOtp?.code) {
      throw new ConflictException(
        `Sorry we cannot grant you new otp until the existing one become expired please try again after:${checkOtp.expiresIn.toString()}`,
      );
    }
    const otp = String(generateOtp());
    
    await this.createConfirmEmailOtp(user._id, otp);
    emailEvent.emit(TypeEnum.ConfirmEmail, { to: email, otp });
    return 'Done';
  }

  async forgotPassword(body:ResendConfirmEmailOtp) {
    const { email } = body;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        provider: ProviderEnum.System,
        isConfirmed: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'In-valid Account due to one of the following reasons [not register ,not confirmed ,invalid provider]',
      );
    }

    const otp = generateOtp();
    const [newOtp] = await this.otpRepository.create({
      data: [{
        createdBy: user._id,
        code: await generateHash(String(otp)),
        type: TypeEnum.ForgetPassword,
        expiresIn: new Date(Date.now() + 3 * 60 * 1000)
      }]
    });
    
    if (!newOtp) {
      throw new BadRequestException(
        'Fail to send the reset code please try again later',
      );
    }

    emailEvent.emit('SendForgotPasswordCode', { to: email, otp });
    return 'Done';
  }

  async resetPassword(body: ResetPasswordBodyDto) {

    const { email, otp, password } = body;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        provider: ProviderEnum.System,
        isConfirmed: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'In-valid Account due to one of the following reasons [not register ,not confirmed ,invalid provider]',
      );
    }

      const checkOtp = await this.otpRepository.findOne({
      filter: {
        createdBy: user._id,
        type: TypeEnum.ForgetPassword,
      }
    });

    if (!checkOtp || !await compareHash(String(otp), checkOtp?.code )) {
      throw new BadRequestException('invalid otp');
    }

    if ((checkOtp?.expiresIn.getTime() ?? 0) < Date.now()) {
      await this.otpRepository.deleteOne({ filter: {type:TypeEnum.ForgetPassword, createdBy: user._id } });
      throw new BadRequestException("Code expired ,You need to request a new one");
    }

    const updatedUser = await this.userRepository.updateOne({
      filter: { email },
      update: {
        password: await generateHash(password),
        changeCredentialTime: new Date(),
      },
    });

    if (!updatedUser.matchedCount) {
      throw new BadRequestException(
        'Fail to reset password please try again later',
      );
    }
    await this.otpRepository.deleteOne({ filter: { type: TypeEnum.ForgetPassword, createdBy: user._id } });
    return 'Done';
  }
  
  async refreshToken(user:UserDocument): Promise<loginCredentials> {
    
    const credentials = await this.tokenService.createLoginCredentials(user);
    return { credentials };
  }
}
