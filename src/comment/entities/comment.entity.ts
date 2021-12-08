import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { TextDataType } from "sequelize/types";
import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";

@Table
export class Comment extends Model<Comment> {
    @ForeignKey(()=> Post)
    @Column
    postId: number
    @ForeignKey(()=> User)
    @Column
    userWhoCommented: number
    @Column(DataType.TEXT)
    comment: TextDataType
}
