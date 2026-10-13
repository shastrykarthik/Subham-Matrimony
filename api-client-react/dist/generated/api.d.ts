import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Connection, ConnectionInput, ConnectionResponseInput, HealthStatus, ListProfilesParams, PendingProfile, Profile, ProfileApproval, ProfileInput, ProfileStats } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListProfilesUrl: (params?: ListProfilesParams) => string;
/**
 * @summary Search publicly approved profiles
 */
export declare const listProfiles: (params?: ListProfilesParams, options?: Parameters<typeof customFetch>[1]) => Promise<Profile[]>;
export declare const getListProfilesQueryKey: (params?: ListProfilesParams) => readonly ["/api/profiles", ...ListProfilesParams[]];
export declare const getListProfilesQueryOptions: <TData = Awaited<ReturnType<typeof listProfiles>>, TError = ErrorType<unknown>>(params?: ListProfilesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProfiles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProfilesQueryResult = NonNullable<Awaited<ReturnType<typeof listProfiles>>>;
export type ListProfilesQueryError = ErrorType<unknown>;
/**
 * @summary Search publicly approved profiles
 */
export declare function useListProfiles<TData = Awaited<ReturnType<typeof listProfiles>>, TError = ErrorType<unknown>>(params?: ListProfilesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateProfileUrl: () => string;
/**
 * @summary Create a profile pending administrator approval
 */
export declare const createProfile: (profileInput: ProfileInput, options?: Parameters<typeof customFetch>[1]) => Promise<Profile>;
export declare const getCreateProfileMutationKey: () => readonly ["createProfile"];
export declare const getCreateProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProfile>>, TError, CreateProfileMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProfile>>, TError, CreateProfileMutationVariables, TContext>;
export type CreateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof createProfile>>>;
export type CreateProfileMutationBody = BodyType<ProfileInput>;
export type CreateProfileMutationError = ErrorType<unknown>;
export type CreateProfileMutationVariables = {
    data: BodyType<ProfileInput>;
};
/**
* @summary Create a profile pending administrator approval
*/
export declare const useCreateProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProfile>>, TError, CreateProfileMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProfile>>, TError, CreateProfileMutationVariables, TContext>;
export declare const getGetProfileStatsUrl: () => string;
/**
 * @summary Get community profile totals
 */
export declare const getProfileStats: (options?: Parameters<typeof customFetch>[1]) => Promise<ProfileStats>;
export declare const getGetProfileStatsQueryKey: () => readonly ["/api/profiles/stats"];
export declare const getGetProfileStatsQueryOptions: <TData = Awaited<ReturnType<typeof getProfileStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfileStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfileStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfileStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getProfileStats>>>;
export type GetProfileStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get community profile totals
 */
export declare function useGetProfileStats<TData = Awaited<ReturnType<typeof getProfileStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfileStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPendingProfilesUrl: () => string;
/**
 * @summary List profiles waiting for moderator review
 */
export declare const listPendingProfiles: (options?: Parameters<typeof customFetch>[1]) => Promise<PendingProfile[]>;
export declare const getListPendingProfilesQueryKey: () => readonly ["/api/profiles/pending"];
export declare const getListPendingProfilesQueryOptions: <TData = Awaited<ReturnType<typeof listPendingProfiles>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPendingProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPendingProfiles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPendingProfilesQueryResult = NonNullable<Awaited<ReturnType<typeof listPendingProfiles>>>;
export type ListPendingProfilesQueryError = ErrorType<unknown>;
/**
 * @summary List profiles waiting for moderator review
 */
export declare function useListPendingProfiles<TData = Awaited<ReturnType<typeof listPendingProfiles>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPendingProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetProfileUrl: (id: number) => string;
/**
 * @summary Get a profile by id
 */
export declare const getProfile: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<Profile>;
export declare const getGetProfileQueryKey: (id: number) => readonly [`/api/profiles/${number}`];
export declare const getGetProfileQueryOptions: <TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
export type GetProfileQueryError = ErrorType<void>;
/**
 * @summary Get a profile by id
 */
export declare function useGetProfile<TData = Awaited<ReturnType<typeof getProfile>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getApproveProfileUrl: (id: number) => string;
/**
 * @summary Approve a profile for public search
 */
export declare const approveProfile: (id: number, profileApproval: ProfileApproval, options?: Parameters<typeof customFetch>[1]) => Promise<Profile>;
export declare const getApproveProfileMutationKey: () => readonly ["approveProfile"];
export declare const getApproveProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveProfile>>, TError, ApproveProfileMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof approveProfile>>, TError, ApproveProfileMutationVariables, TContext>;
export type ApproveProfileMutationResult = NonNullable<Awaited<ReturnType<typeof approveProfile>>>;
export type ApproveProfileMutationBody = BodyType<ProfileApproval>;
export type ApproveProfileMutationError = ErrorType<unknown>;
export type ApproveProfileMutationVariables = {
    id: number;
    data: BodyType<ProfileApproval>;
};
/**
* @summary Approve a profile for public search
*/
export declare const useApproveProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveProfile>>, TError, ApproveProfileMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof approveProfile>>, TError, ApproveProfileMutationVariables, TContext>;
export declare const getListConnectionsUrl: () => string;
/**
 * @summary List the signed-in member's sent and received requests
 */
export declare const listConnections: (options?: Parameters<typeof customFetch>[1]) => Promise<Connection[]>;
export declare const getListConnectionsQueryKey: () => readonly ["/api/connections"];
export declare const getListConnectionsQueryOptions: <TData = Awaited<ReturnType<typeof listConnections>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConnections>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listConnections>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListConnectionsQueryResult = NonNullable<Awaited<ReturnType<typeof listConnections>>>;
export type ListConnectionsQueryError = ErrorType<unknown>;
/**
 * @summary List the signed-in member's sent and received requests
 */
export declare function useListConnections<TData = Awaited<ReturnType<typeof listConnections>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConnections>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateConnectionUrl: () => string;
/**
 * @summary Send a connection request
 */
export declare const createConnection: (connectionInput: ConnectionInput, options?: Parameters<typeof customFetch>[1]) => Promise<Connection>;
export declare const getCreateConnectionMutationKey: () => readonly ["createConnection"];
export declare const getCreateConnectionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createConnection>>, TError, CreateConnectionMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createConnection>>, TError, CreateConnectionMutationVariables, TContext>;
export type CreateConnectionMutationResult = NonNullable<Awaited<ReturnType<typeof createConnection>>>;
export type CreateConnectionMutationBody = BodyType<ConnectionInput>;
export type CreateConnectionMutationError = ErrorType<unknown>;
export type CreateConnectionMutationVariables = {
    data: BodyType<ConnectionInput>;
};
/**
* @summary Send a connection request
*/
export declare const useCreateConnection: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createConnection>>, TError, CreateConnectionMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createConnection>>, TError, CreateConnectionMutationVariables, TContext>;
export declare const getRespondToConnectionUrl: (id: number) => string;
/**
 * @summary Accept or decline an incoming connection request
 */
export declare const respondToConnection: (id: number, connectionResponseInput: ConnectionResponseInput, options?: Parameters<typeof customFetch>[1]) => Promise<Connection>;
export declare const getRespondToConnectionMutationKey: () => readonly ["respondToConnection"];
export declare const getRespondToConnectionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof respondToConnection>>, TError, RespondToConnectionMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof respondToConnection>>, TError, RespondToConnectionMutationVariables, TContext>;
export type RespondToConnectionMutationResult = NonNullable<Awaited<ReturnType<typeof respondToConnection>>>;
export type RespondToConnectionMutationBody = BodyType<ConnectionResponseInput>;
export type RespondToConnectionMutationError = ErrorType<unknown>;
export type RespondToConnectionMutationVariables = {
    id: number;
    data: BodyType<ConnectionResponseInput>;
};
/**
* @summary Accept or decline an incoming connection request
*/
export declare const useRespondToConnection: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof respondToConnection>>, TError, RespondToConnectionMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof respondToConnection>>, TError, RespondToConnectionMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map