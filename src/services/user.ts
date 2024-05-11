import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthState } from '../store/auth/auth-slice'
import { UserTagType } from './tags/user'
import { User } from '../models/User'
import { PasswordDto } from '../models/dto/PasswordDto'

export const userApi = createApi({
	reducerPath: 'userApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${process.env.REACT_APP_APIURL}/user`,
		prepareHeaders: (headers, api) => {
			const {
				auth: { jwt },
			} = api.getState() as { auth: AuthState }
			headers.set('Authorization', `Bearer ${jwt}`)
			headers.set('content-type', 'application/json')
		},
	}),
	tagTypes: [UserTagType],
	endpoints: builder => ({
		getUserById: builder.query<User, string>({
			query: userId => `/${userId}`,
			providesTags: user => (!!user ? [{ type: UserTagType, id: user._id }] : []),
		}),
		getCurrentUser: builder.query<User, void>({
			query: () => '',
			providesTags: user => (!!user ? [{ type: UserTagType, id: user._id }] : []),
		}),
		changePassword: builder.mutation<boolean, { userId: string; password: PasswordDto }>({
			query: ({ userId, password }) => ({
				url: `/${userId}/password`,
				method: 'PUT',
				body: JSON.stringify(password),
			}),
			invalidatesTags: (result, _, { userId }) => (result ? [{ type: UserTagType, id: userId }] : []),
		}),
	}),
})

export const { useChangePasswordMutation, useGetCurrentUserQuery, useGetUserByIdQuery } = userApi