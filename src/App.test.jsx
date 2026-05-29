import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

const { test, expect } = globalThis

const enterWithPassphrase = async () => {
  render(<App />)
  fireEvent.click(screen.getByText('打开这封信'))
  const input = screen.getByPlaceholderText('是那句只有我们懂的话')
  fireEvent.change(input, { target: { value: '冉冉宝宝' } })
  fireEvent.click(screen.getByText('确认'))
  await new Promise((r) => setTimeout(r, 2100))
}

const openChapter = async (cardTitle) => {
  await enterWithPassphrase()
  fireEvent.click(screen.getByText(cardTitle))
  await new Promise((r) => setTimeout(r, 2500))
}

test('shows cover page initially', () => {
  render(<App />)
  expect(screen.getByText('有一封信')).toBeTruthy()
  expect(screen.getByText('打开这封信')).toBeTruthy()
})

test('shows WhisperEnvelopes module', async () => {
  await openChapter('打开小机关')
  expect(screen.getByText('星冉专属甜甜印章册')).toBeTruthy()
  expect(screen.getAllByText('今日想你章').length).toBeGreaterThan(0)
  expect(screen.getByText('写给小羊的悄悄话')).toBeTruthy()
})

test('shows gate page after clicking open', () => {
  render(<App />)
  fireEvent.click(screen.getByText('打开这封信'))
  expect(screen.getByText('请输入我们之间的小暗号')).toBeTruthy()
})

test('shows error for wrong passphrase', () => {
  render(<App />)
  fireEvent.click(screen.getByText('打开这封信'))
  const input = screen.getByPlaceholderText('是那句只有我们懂的话')
  fireEvent.change(input, { target: { value: '错误的暗号' } })
  fireEvent.click(screen.getByText('确认'))
  expect(screen.getByRole('alert').textContent).toContain('好像还差一点点')
})

test('transitions after correct passphrase', () => {
  render(<App />)
  fireEvent.click(screen.getByText('打开这封信'))
  const input = screen.getByPlaceholderText('是那句只有我们懂的话')
  fireEvent.change(input, { target: { value: '冉冉宝宝' } })
  fireEvent.click(screen.getByText('确认'))
  expect(screen.getByText('暗号正确，正在把这封信交给你。')).toBeTruthy()
})

test('shows media cinema module on letter page', async () => {
  await openChapter('翻一页回忆')
  expect(screen.getByText('我们的精彩瞬间')).toBeTruthy()
  expect(screen.getByText('每一帧都值得被好好保存。')).toBeTruthy()
  expect(screen.getByText('我们的回忆电影胶片')).toBeTruthy()
}, 10000)

test('shows sheep home easter egg and comfort pasture', async () => {
  await enterWithPassphrase()
  expect(screen.getByLabelText('小羊宝宝的安心牧场已经亮灯啦')).toBeTruthy()
  fireEvent.click(screen.getByText('给你加油'))
  await new Promise((r) => setTimeout(r, 1300))
  expect(screen.getByText('小羊宝宝的安心牧场')).toBeTruthy()
  expect(screen.getByText('抱抱小羊')).toBeTruthy()
  expect(screen.getByText('今日小羊礼物')).toBeTruthy()
  expect(screen.getByText('打开今日小羊礼物')).toBeTruthy()
})

test('shows sheep confession ritual on final chapter', async () => {
  await openChapter('最后一章')
  expect(screen.getByText('把小羊宝宝抱进心里')).toBeTruthy()
  expect(screen.getByText('点亮第一圈光')).toBeTruthy()
  expect(screen.getByText('把小羊抱进心里')).toBeTruthy()
  expect(screen.getByText('小羊专属纪念卡')).toBeTruthy()
  expect(screen.getByText('可以截图保存这一张小小的偏爱证明')).toBeTruthy()
})

test('shows full interactive romance modules', async () => {
  await openChapter('打开小机关')
  expect(screen.getByText('520 心动小问答')).toBeTruthy()
  expect(screen.getByText('小羊宝宝的心动粒子宇宙')).toBeTruthy()
  expect(screen.getByText('点一下，换一种心动形状')).toBeTruthy()
  expect(screen.getByText('小羊的今日心动盲盒')).toBeTruthy()
  expect(screen.getByText('打开盲盒')).toBeTruthy()
  expect(screen.getByText('给小羊的许愿瓶')).toBeTruthy()
  expect(screen.getByText('摇一摇')).toBeTruthy()
  expect(screen.getByText('小羊今日专属天气预报')).toBeTruthy()
  expect(screen.getByText('查收今日天气')).toBeTruthy()
  expect(screen.getByText('星冉的专属勋章墙')).toBeTruthy()
  expect(screen.getByText('给小羊的每日一问')).toBeTruthy()
  expect(screen.getByText('抽一道题')).toBeTruthy()
  expect(screen.getAllByText('摇一摇，抽今日运势')[0]).toBeTruthy()
  expect(screen.getAllByText('点击摇一摇')[0]).toBeTruthy()
  expect(screen.getAllByText('写一句话给我')[0]).toBeTruthy()
  expect(screen.getAllByText('把我们的名字拼在一起')[0]).toBeTruthy()
  expect(screen.getAllByText('我们的专属时间胶囊')[0]).toBeTruthy()
  expect(screen.getAllByText('封存进胶囊')[0]).toBeTruthy()
})
