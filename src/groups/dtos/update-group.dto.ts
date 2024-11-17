import { PartialType } from "@nestjs/swagger";
import { CreateGroupDto } from "./create-group.dto";

export class UpdatedGroupDto extends PartialType(CreateGroupDto) {}
