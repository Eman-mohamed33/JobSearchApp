import { Body, Controller, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { Auth, IResponse, successResponse, User } from 'src/common';
import { ConfirmEmailBodyDto, LoginBodyDto, ResendConfirmEmailOtp, ResetPasswordBodyDto, SignupBodyDto, VerifyGmail } from './dto/auth.dto';
import { loginCredentials } from './entities/auth.entity';
import { type UserDocument } from 'src/DB/models/user.model';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }
  
  @Post("signup")
  async signup(
    @Body() body: SignupBodyDto,
  ): Promise<IResponse> {
    await this.authenticationService.signup(body);
    return successResponse({ message: "Done", status: 201 });
  }

  @Post("login")
  async login(
    @Body() body: LoginBodyDto,
  ): Promise<IResponse<loginCredentials>> {
    const credentials = await this.authenticationService.login(body);
    return successResponse<loginCredentials>({ message: "Done", data: credentials, status: 201 });
  }


  @Post("signup-with-gmail")
  async signupWithGmail(
    @Body() body: VerifyGmail,
  ): Promise<IResponse> {
    await this.authenticationService.signupWithGmail(body);
    return successResponse({ message: "Done", status: 201 });
  }

  @Post("login-with-gmail")
  async loginWithGmail(
    @Body() body: VerifyGmail,
  ): Promise<IResponse<loginCredentials>> {
    const credentials = await this.authenticationService.loginWithGmail(body);
    return successResponse<loginCredentials>({ message: "Done", data: credentials, status: 201 });
  }

  @Patch("confirm-email")
  async confirmEmail(
    @Body() body: ConfirmEmailBodyDto,
  ): Promise<IResponse> {
    await this.authenticationService.confirmEmail(body);
    return successResponse({ message: "Done", status: 200 });
  }

  @Patch("resend-confirm-email-otp")
  async resendConfirmEmailOtp(
    @Body() body: ResendConfirmEmailOtp,
  ): Promise<IResponse> {
    await this.authenticationService.resendConfirmEmailOtp(body);
    return successResponse({ message: "Done", status: 200 });
  }

  @Patch("forgot-password")
  async forgotPassword(
    @Body() body: ResendConfirmEmailOtp,
  ): Promise<IResponse> {
    await this.authenticationService.forgotPassword(body);
    return successResponse({ message: "Done", status: 200 });
  }


  @Patch("reset-password")
  async resetPassword(
    @Body() body: ResetPasswordBodyDto,
  ): Promise<IResponse> {
    await this.authenticationService.resetPassword(body);
    return successResponse({ message: "Done", status: 200 });
  }



  @Patch("refresh-token")
  async refreshToken(
    @User() user: UserDocument,
  ): Promise<IResponse<loginCredentials>> {
   
    const credentials = await this.authenticationService.refreshToken(user);
    return successResponse<loginCredentials>({ message: "Done", data: credentials, status: 201 });
  }
}
