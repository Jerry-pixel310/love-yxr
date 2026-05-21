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

test('shows cover page initially', () => {
  render(<App />)
  expect(screen.getByText('有一封信')).toBeTruthy()
  expect(screen.getByText('打开这封信')).toBeTruthy()
})

test('shows WhisperEnvelopes module', async () => {
  await enterWithPassphrase()
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
  await enterWithPassphrase()
  expect(screen.getByText('冉冉宝宝的回忆放映厅')).toBeTruthy()
  expect(screen.getByText('这里放着只想给你看的画面。')).toBeTruthy()
  expect(screen.getByText('这是一段只给冉冉宝宝看的小电影。')).toBeTruthy()
})

test('shows full interactive romance modules', async () => {
  await enterWithPassphrase()
  expect(screen.getByText('如果把想你写成聊天记录')).toBeTruthy()
  expect(screen.getByText('抽一张今天的心动签')).toBeTruthy()
  expect(screen.getByText('520 心动小问答')).toBeTruthy()
  expect(screen.getByText('转一转，抽今日约会计划')).toBeTruthy()
  expect(screen.getByText('测测我们的今日甜度')).toBeTruthy()
  expect(screen.getByText('我们的小时光轴')).toBeTruthy()
  expect(screen.getByText('今天也在想冉冉')).toBeTruthy()
  expect(screen.getByText('这是我想冉冉的')).toBeTruthy()
  expect(screen.getByText('冉冉的心动粒子宇宙')).toBeTruthy()
  expect(screen.getByText('点一下，换一种心动形状')).toBeTruthy()
  expect(screen.getByText('全屏打开这片星河')).toBeTruthy()
  expect(screen.getByText('送冉冉一朵冰玫瑰')).toBeTruthy()
  expect(screen.getByText('打开冰玫瑰全屏特效')).toBeTruthy()
  expect(screen.getByText('把想你拼成一颗心')).toBeTruthy()
  expect(screen.getByText('点亮满屏心动')).toBeTruthy()
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
  expect(screen.getAllByText('给冉冉的高考加油站')[0]).toBeTruthy()
  expect(screen.getAllByText('换一句加油')[0]).toBeTruthy()
  expect(screen.getByText('给小羊宝宝的悄悄回信')).toBeTruthy()
  expect(screen.getByText('把回信寄给你')).toBeTruthy()
})

test('opens ice rose modal with original video', async () => {
  await enterWithPassphrase()
  fireEvent.click(screen.getByText('打开冰玫瑰全屏特效'))
  expect(screen.getByLabelText('冰玫瑰原视频')).toBeTruthy()
})
