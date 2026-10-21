import { expect, test } from 'bun:test'
import { featureLines } from './vehicle-features'

test('featureLines drops photo keys and a leading colon', () => {
  expect(featureLines({
    Places: ': 4',
    Puissance: '285 ch',
    face: 'right',
    cover: '/c.webp',
    source: 'catalogue-2026-09',
    spot: '/a.jpg',
    pos: '50% 50%',
    Vide: '  ',
  })).toEqual([
    ['Places', '4'],
    ['Puissance', '285 ch'],
  ])
})
