import { Min } from 'class-validator';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@InputType()
export class StringFilter {
	@Field({ nullable: true })
	eq?: string;

	@Field({ nullable: true })
	like?: string;

	@Field({ nullable: true })
	neq?: string;

	@Field({ nullable: true })
	notLike?: string;

	@Field({ nullable: true })
	isNull?: boolean;

	@Field({ nullable: true })
	isNotNull?: boolean;
}

@InputType()
export class NumberFilter {
	@Field({ nullable: true, description: 'Equal to' })
	eq?: number;

	@Field({ nullable: true, description: 'Less than' })
	lt?: number;

	@Field({ nullable: true, description: 'Greater than' })
	gt?: number;

	@Field({ nullable: true, description: 'Less than or equal to' })
	lte?: number;

	@Field({ nullable: true, description: 'Greater than or equal to' })
	gte?: number;

	@Field({ nullable: true, description: 'Is null' })
	isNull?: boolean;

	@Field({ nullable: true, description: 'Is not null' })
	isNotNull?: boolean;

	@Field({ nullable: true, description: 'Is not equal to' })
	neq?: number;
}

@InputType()
export class DateFilter {
	@Field((type) => String, { nullable: true, description: 'Equal to' })
	eq?: String;

	@Field((type) => String, { nullable: true, description: 'Less than' })
	lt?: String;

	@Field((type) => String, {
		nullable: true,
		description: 'Greater than or equal to',
	})
	gt?: String;

	@Field((type) => String, {
		nullable: true,
		description: 'Less than or equal to',
	})
	lte?: String;

	@Field((type) => String, {
		nullable: true,
		description: 'Greater than or equal to',
	})
	gte?: number;

	@Field({ nullable: true, description: 'Is null' })
	isNull?: boolean;

	@Field({ nullable: true, description: 'Is not null' })
	isNotNull?: boolean;

	@Field((type) => String, { nullable: true, description: 'Is not equal to' })
	neq?: String;
}

@InputType()
export class BooleanFilter {
	@Field({ nullable: true, description: 'Equal to' })
	eq?: boolean;

	@Field({ nullable: true, description: 'Is not equal to' })
	neq?: boolean;
}


@ObjectType()
export class PaginationResult {
	@Field({
		description:
			'The total number of results regardless of pagination and filters provided',
	})
	totalCount: number;

	@Field({
		description:
			'The number of results included in this query (after pagination and filtering)',
	})
	count: number;

	@Field({
		description:
			'The possible number of pages. Calculated from the pagination input',
	})
	pageCount: number;
}

// export enum SortDirection {
// 	ASC = 'ASC', //ascending order
// 	DESC = 'DESC', //descending order
// }

@InputType({
	description: 'The number of results to start from and to include',
})
export class PaginationInput {
	@Field((type) => Int, {
		defaultValue: 0,
		description:
			'The page to start from. 1 based indexing (NOT 0 based). A value of 0 will start from page 1 (0 and 1 have the same meaning)',
	})
	@Min(0)
	page: number;

	@Field((type) => Int, {
		defaultValue: -1,
		description: 'The number of results to include. -1 means fetch all',
	})
	@Min(-1)
	count: number;

	// @Field((type) => SortDirection, {
	// 	description: 'The sort direction to use. Defaults to ASC',
	// 	nullable: true,
	// 	defaultValue: SortDirection.ASC,
	// })
	// sortDirection?: SortDirection;
}