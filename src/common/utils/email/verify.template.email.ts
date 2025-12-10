export const verifyEmailTemplate = ({
  otp,
  userEmail,
  title,
}: {
  otp: string,
  userEmail: string,
  title: string,
}): string => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#E9D4EC;font-family:Arial, Helvetica, sans-serif;">

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background:#E9D4EC;padding:20px 0;">
        <tr>
            <td align="center">
                <!-- Wrapper -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
                    style="background:#FFFFFF;border-radius:8px;overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td style="padding:20px;text-align:center;background:#F3D6E8;">
                            <img src="https://img.icons8.com/color/96/000000/verified-account.png" alt="Logo"
                                style="display:block;border:0;max-width:120px;margin:0 auto;">
                            <h2
                                style="margin:10px 0 0 0;font-size:20px;color:#D46CB4;font-family:Arial, Helvetica, sans-serif;">
                                Social Media App
                            </h2>
                        </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td style="padding:40px 20px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;color:#333;">${title}</h1>
                            <p style="margin:16px 0;color:#666;font-size:15px;">
                                We’ve sent a 6-digit code to <strong>${userEmail}</strong>.
                                Please enter it below to confirm your email address.
                            </p>

                            <!-- OTP code -->
                            <h2
                                style="margin:20px 0;border-radius:6px;display:inline-block;padding:12px 24px;background:#D46CB4;color:#fff;font-size:20px;letter-spacing:2px;">
                                ${otp}
                            </h2>

                            <!-- Confirm Button -->
                            <div style="margin:30px 0;">
                               <a href= target="_blank" 
                                    style="background:#D46CB4;color:#fff;text-decoration:none;padding:14px 30px;border-radius:6px;font-weight:bold;display:inline-block;">
                                    Confirm Email
                                </a>
                            </div>

                            <p style="margin:16px 0;color:#666;font-size:14px;">
                                Didn’t receive the email? <a href="" target="_blank"
                                    style="color:#D46CB4;text-decoration:none;">Resend email</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px;background:#F3D6E8;text-align:center;font-size:12px;color:#555;">
                            <p style="margin:0 0 6px 0;">You received this email because you signed up for our service.
                            </p>
                            <p style="margin:0;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- /Wrapper -->
            </td>
        </tr>
    </table>

</body>

</html>`;
};

export const acceptApplicationTemplate = (userName: string, companyName: string): string => {
    return `<h2 style="color: #2ecc71;">🎉 Congratulations!</h2>

<p>Dear <b>${userName}</b>,</p>

<p>
We are pleased to inform you that your application has been 
<b style="color: green;">accepted</b>.
</p>

<p>
You are now officially part of our platform, and we look forward 
to working with you.
</p>

<p>
If you have any questions, feel free to contact our support team.
</p>

<br>

<p>Best regards,</p>
<p><b>${companyName}</b></p>
`;
};

export const rejectApplicationTemplate = (userName: string, companyName: string): string => {
    return `<h2 style="color: #e74c3c;">Application Update</h2>

<p>Dear <b>${userName}</b>,</p>

<p>
Thank you for your interest in joining <b>{{companyName}}</b>.
</p>

<p>
After careful review, we regret to inform you that your application
has been <b style="color: red;">rejected</b> at this time.
</p>

<p>
We truly appreciate your time and effort, and we encourage you
to apply again in the future.
</p>

<br>

<p>Wishing you all the best,</p>
<p><b>${companyName}</b></p>
`;
};
