
import 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        userName?: string;
        email?: string;
        password?: string;
        verifyCode?: number;
        isVerified?: boolean;
        verifyCodeExpiry?: Date;
        isAcceptMessage?: boolean;
        
    }
    interface Session {
        user: {
            _id?: string;
            userName?: string;
            email?: string;
            password?: string;
            verifyCode?: number;
            isVerified?: boolean;
            verifyCodeExpiry?: Date;
            isAcceptMessage?: boolean;
            
        }& DefaultSession['user'];
    }
}
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        userName?: string;
        email?: string;
        password?: string;
        verifyCode?: number;
        isVerified?: boolean;
        verifyCodeExpiry?: Date;
        isAcceptMessage?: boolean;
        
    }
}