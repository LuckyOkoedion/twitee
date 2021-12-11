import { Exclude } from "class-transformer"

export class CommentResponseDto {
    "postId": number
    "userWhoCommented": number
    "comment": any
}

export class PostResponseDto {
    "author": number
    "post": any
}

export class UserDetailResponseDto {
    "id": number
    "name": string
    "email": string
    @Exclude()
    "password": string
    "date_created": string
    "createdAt": string
    "updatedAt": string
    "posts": PostResponseDto[]
    "comments": CommentResponseDto[]
    "likes": LikeResponseDto[]

    constructor(partial: Partial<UserDetailResponseDto>) {
        Object.assign(this, partial);
    }
}

export class LikeResponseDto {
    "postId": number
    "userWhoLiked": number
}




export class CommentDetailResponseDto {
    "id": number
    "postId": number
    "userWhoCommented": number
    "comment": any
    "createdAt": string
    "updatedAt": string
    "theCommenter": UserResponseDto

}


export class PostDetailResponseDto {
    "id": number
    "author": number
    "post": any
    "createdAt": string
    "updatedAt": string
    "comments": CommentResponseDto[]
    "likes": LikeResponseDto[]
    "theAuthor": UserResponseDto
}

export class UserResponseDto {
    "name": string
    "email": string
}