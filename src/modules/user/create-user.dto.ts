// src/modules/user/create-user.dto.ts

import { IsString, IsEmail, MinLength, IsNotEmpty, ArrayMinSize, ValidateNested, IsIn, Matches, ArrayMaxSize } from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role ID is required' })
  rid: number;

  @IsNotEmpty({ message: 'Role name is required' })
  @IsIn(['admin', 'user'], { message: 'Invalid role name' }) // Use @IsIn for allowed roles
  rname: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Invalid name format' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsString({ message: 'Invalid employee ID format' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches( /^[a-zA-Z0-9]{14}$/,{message:"Invalid Emp id"})
  emp_id: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsEmail({}, { message: 'Invalid username format' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,{message:"Give proper uname "})
  uname: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Invalid password format' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  pwd: string;

  @IsNotEmpty({ message: 'Communication email is required' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,{message:"Give proper comm mail "})
  comm_email: string;

  @IsNotEmpty({ message: 'Department is required' })
  @IsString({ message: 'Invalid department format' })
  dept: string;

  @IsNotEmpty({ message: 'Roles are required' })
  @ArrayMinSize(1, { message: 'At least one role is required' })
  @ArrayMaxSize(2,{message:"Only two roles allowed"})
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  roles: CreateRoleDto[];

  active: boolean;

  created_at: number;

  updated_at: number;
}
