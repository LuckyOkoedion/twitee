import { DecimalDataType, TextDataType } from "sequelize/types";
import { Column, DataType, Table, Model, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Comment } from "src/comment/entities/comment.entity";
import { Like } from "src/like/entities/like.entity";
import { User } from "src/user/entities/user.entity";

@Table
export class Post extends Model<Post> {
    @ForeignKey(() => User)
    @Column
    author: number
    @Column(DataType.TEXT)
    post: TextDataType
    @HasMany(() => Comment)
    comments: Comment[]
    @HasMany(() => Like)
    likes: Like[]
    @BelongsTo(() => User)
    theAuthor: User

}
