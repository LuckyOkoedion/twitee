export class CreateUserDto {
    name: string
    email: string
    password: string
}

export class LoginDto {
    readonly email: string;
    readonly password: string;
}

export class UserDataDto {
    readonly email: string;
    readonly userId: string;
}
