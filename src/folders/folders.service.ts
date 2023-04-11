import { UsersService } from './../users/users.service';
import { TokensService } from './../tokens/tokens.service';
import { FolderTypesService } from './services/folder-types.service';
import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFolderDto, FolderDataDto, PatchFolderDto, UglyFolderDataDto } from './dto';
import { FolderAppearancesService } from './appearance/folder-appearances.service';
import { FOLDER_SELECT } from './folders.constants';
import { NOTHING_PASSED, NOT_FOUND } from '@constants/error';

@Injectable()
export class FoldersService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => FolderAppearancesService))
    private folderAppearancesService: FolderAppearancesService,
    private folderTypesService: FolderTypesService,
    private tokensService: TokensService,
    private usersService: UsersService,
  ) {}

  async create(accessToken, dto: CreateFolderDto): Promise<FolderDataDto> {
    const folderType = await this.folderTypesService.findByValue(dto.folderType);

    const { userId } = this.tokensService.validateAccessToken(accessToken);
    const user = await this.usersService.findById(userId);

    const folderData = await this.prismaService.folder.create({
      data: {
        name: dto.name,
        folderTypeId: folderType.id,
        companyId: user.companyId,
        ownerId: user.id,
      },
    });

    //it needs to create appearance entity after folder entity (requires its id)
    await this.folderAppearancesService.create(folderData.id, dto.folderAppearance);

    const updatedFolder: UglyFolderDataDto = await this.prismaService.folder.findUnique({
      where: { id: folderData.id },
      select: FOLDER_SELECT,
    });

    return this.makeFolderResponse(updatedFolder);
  }

  async findById(id: string): Promise<FolderDataDto> {
    const folderData: UglyFolderDataDto = await this.prismaService.folder.findUnique({
      where: { id },
      select: FOLDER_SELECT,
    });

    if (!folderData) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.makeFolderResponse(folderData);
  }

  async findByUserId(accessToken: string): Promise<FolderDataDto[]> {
    const { userId } = this.tokensService.validateAccessToken(accessToken);
    const user = await this.usersService.findById(userId);

    const foldersData: UglyFolderDataDto[] = await this.prismaService.folder.findMany({
      where: { ownerId: user.id },
      select: FOLDER_SELECT,
    });

    return foldersData.map((folder) => this.makeFolderResponse(folder));
  }

  async patchOne(accessToken: string, id: string, dto: PatchFolderDto): Promise<FolderDataDto> {
    if (Object.keys(dto).length < 1) {
      throw new BadRequestException(NOTHING_PASSED);
    }

    const { userId } = this.tokensService.validateAccessToken(accessToken);

    const folder = await this.prismaService.folder.findUnique({ where: { id }, select: { ownerId: true } });

    if (userId !== folder.ownerId) {
      throw new ForbiddenException();
    }

    const updatedFolder: UglyFolderDataDto = await this.prismaService.folder.update({
      where: { id },
      data: { ...dto },
      select: FOLDER_SELECT,
    });

    return this.makeFolderResponse(updatedFolder);
  }

  private makeFolderResponse(folderData: UglyFolderDataDto): FolderDataDto {
    return {
      ...folderData,
      users: folderData.users.map((userWrappedObj) => userWrappedObj.users), // make from users[0].users => users[0]
      folderAppearance: this.folderAppearancesService.makeFolderAppearanceResponse(folderData.folderAppearance), // make from users[0].users => users[0]
      folderType: folderData.folderType.type,
    };
  }
}
