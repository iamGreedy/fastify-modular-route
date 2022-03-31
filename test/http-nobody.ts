import { pito } from 'pito'
import tap from 'tap'
import { HTTPNoBody } from '../cjs'


tap.test('builder', async t => {
    const header = pito.obj({
        Help: pito.regex('^Help [a-zA-Z_\-]+')
    })
    const query = pito.obj({
        Q: pito.num()
    })
    const param = pito.obj({
        c: pito.num()
    })
    const res = pito.int()


    const def = HTTPNoBody("GET", "/a/b/:c/d", 'Test')
        .withHeaders(header)
        .withParams(param)
        .withQuery(query)
        .withResponse(res)
        .build()

    t.same(
        def.domain,
        'Test',
    )
    t.same(
        pito.strict(def.headers),
        pito.strict(header),
    )
    t.same(
        pito.strict(def.params),
        pito.strict(param),
    )
    t.same(
        pito.strict(def.query),
        pito.strict(query),
    )
    t.same(
        pito.strict(def.response),
        pito.strict(res),
    )
})


tap.test('builder no param', async t => {
    const def = HTTPNoBody("GET", "/a/b/c/d").build()

    t.same(
        def.domain,
        '',
    )
    t.same(
        def.path,
        '/a/b/c/d',
    )
})