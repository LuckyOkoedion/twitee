import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Post } from "src/post/entities/post.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { Like } from "src/like/entities/like.entity";
import { Exclude } from "class-transformer";

@Table
export class User extends Model<User> {
    @Column
    name: string
    @Column
    email: string
    @Column
    password?: string
    @Column
    date_created: string
    @HasMany(() => Post)
    posts: Post[]
    @HasMany(() => Comment)
    comments: Comment[]
    @HasMany(() => Like)
    likes: Like[]
}
