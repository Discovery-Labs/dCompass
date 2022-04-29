import { Injectable } from "@nestjs/common";
import { Tag, Prisma } from "@prisma/client";
import { PrismaService } from "src/services/prisma/Prisma.service";

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async tag(
    tagWhereUniqueInput: Prisma.TagWhereUniqueInput
  ): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: tagWhereUniqueInput,
    });
  }

  async tags(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TagWhereUniqueInput;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithRelationInput;
  }): Promise<Tag[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.tag.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTag(data: Prisma.TagCreateInput): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  }

  async updateTag(params: {
    where: Prisma.TagWhereUniqueInput;
    data: Prisma.TagUpdateInput;
  }): Promise<Tag> {
    const { data, where } = params;
    return this.prisma.tag.update({
      data,
      where,
    });
  }

  async deleteTag(where: Prisma.TagWhereUniqueInput): Promise<Tag> {
    return this.prisma.tag.delete({
      where,
    });
  }
}
