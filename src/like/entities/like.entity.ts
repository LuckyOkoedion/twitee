import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";

@Table
export class Like extends Model<Like> {
    @ForeignKey(() => Post)
    @Column
    postId: number
    @ForeignKey(() => User)
    @Column
    userWhoLiked: number
}
