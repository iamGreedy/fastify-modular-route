import { pito } from "pito"
import { MethodSSE } from "./methods.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"


export type SSE
    <
        Domain extends string,
        Presets extends AnyPresets,
        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito,
        Packet extends pito = pito,
        Fail extends pito = pito.Any,
    > = {
        readonly domain: Domain
        presets: Presets[]
        description?: string
        summary?: string
        externalDocs?: { url: string, description?: string }

        readonly method: MethodSSE,
        readonly path: Path,
        params: Params,
        query: Query,
        packet: Packet,
        fail: Fail,
    }

export type SSEBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,

        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Packet extends pito,
        Fail extends pito,
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): SSEBuilder<Domain, Presets | NewPresets, Path, Params, Query, Packet, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): SSEBuilder<Domain, Presets | NewPresets[number], Path, Params, Query, Packet, Fail>
        description(contents: string): SSEBuilder<Domain, Presets, Path, Params, Query, Packet, Fail>
        summary(contents: string): SSEBuilder<Domain, Presets, Path, Params, Query, Packet, Fail>
        externalDocs(url: string, description?: string): SSEBuilder<Domain, Presets, Path, Params, Query, Packet, Fail>
        // 
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : SSEBuilder<Domain, Presets, Path, NewParams, Query, Packet, Fail>
        query
            <NewQuery extends pito>
            (query: NewQuery)
            : SSEBuilder<Domain, Presets, Path, Params, NewQuery, Packet, Fail>
        packet
            <NewPacket extends pito>
            (packet: NewPacket)
            : SSEBuilder<Domain, Presets, Path, Params, Query, NewPacket, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : SSEBuilder<Domain, Presets, Path, Params, Query, Packet, NewFail>
        // withs
        withPresets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): SSEBuilder<Domain, Presets | NewPresets[number], Path, Params, Query, Packet, Fail>

        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : SSEBuilder<Domain, Presets, Path, NewParams, Query, Packet, Fail>
        withQuery
            <NewQuery extends pito>
            (query: NewQuery)
            : SSEBuilder<Domain, Presets, Path, Params, NewQuery, Packet, Fail>
        withPacket
            <NewPacket extends pito>
            (packet: NewPacket)
            : SSEBuilder<Domain, Presets, Path, Params, Query, NewPacket, Fail>
        withFail
            <NewFail extends pito>
            (fail: NewFail)
            : SSEBuilder<Domain, Presets, Path, Params, Query, Packet, NewFail>
        build(): SSE<Domain, 'http' | 'sse' | Presets, Path, Params, Query, Packet, Fail>
    }

export function SSE
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : SSEBuilder<
        Domain,
        'http' | 'sse',
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        pito.Any,
        pito.Any,
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: SSE<Domain, string, Path, pito.Obj<Record<ParseRouteKeys<Path>, pito.Str>>, pito.Any, pito.Any> = {
        // @ts-expect-error
        domain: domain ?? '',
        method: 'SSE',
        presets: ['http', 'sse'],
        path: path,
        // @ts-expect-error
        params: pito.Obj(params),
        query: pito.Any(),
        packet: pito.Any(),
        fail: pito.Any()
    }
    return {
        // ==================================================
        // shorts
        // @ts-expect-error
        presets(...presets) {
            target.presets.push(...presets)
            return this
        },
        description(contents) {
            target.description = contents
            return this
        },
        summary(contents) {
            target.summary = contents
            return this
        },
        externalDocs(url, description?) {
            target.externalDocs = { url, ...(description !== undefined ? { description } : {}) }
            return this
        },
        params(params) {
            target.params = params as any
            return this as any
        },
        query(query) {
            target.query = query as any
            return this as any
        },
        packet(packet) {
            target.packet = packet as any
            return this as any
        },
        fail(fail) {
            target.fail = fail as any
            return this as any
        },
        // ==================================================
        // withs
        withPresets(...presets) {
            target.presets.push(...presets)
            return this
        },
        withParams(params) {
            target.params = params as any
            return this as any
        },
        withQuery(query) {
            target.query = query as any
            return this as any
        },
        withPacket(packet) {
            target.packet = packet as any
            return this as any
        },
        withFail(fail) {
            target.fail = fail as any
            return this as any
        },
        // ==================================================
        // @ts-expect-error
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http', 'sse']))
            return target
        }

    }
}