import { describe, test, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTradingStore } from '../store/tradingStore'

const mockTicker = {
  symbol: 'AAPL', name: 'Apple Inc.', price: 190,
  change: 1.5, changePct: 0.8, prevPrice: 188.5,
  volatility: 0.008, timestamp: Date.now()
}

describe('TradingStore', () => {
  beforeEach(() => {
    useTradingStore.setState({
      tickers: {}, selectedSymbol: 'AAPL',
      alerts: [], notifications: []
    })
  })

  test('updateTicker stores ticker data', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.updateTicker(mockTicker))
    expect(result.current.tickers['AAPL']).toEqual(mockTicker)
  })

  test('setSelected changes selected symbol', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.setSelected('TSLA'))
    expect(result.current.selectedSymbol).toBe('TSLA')
  })

  test('addAlert creates an alert', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.addAlert('AAPL', 'above', 200))
    expect(result.current.alerts).toHaveLength(1)
    expect(result.current.alerts[0].threshold).toBe(200)
    expect(result.current.alerts[0].type).toBe('above')
  })

  test('removeAlert deletes alert by id', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.addAlert('AAPL', 'above', 200))
    const id = result.current.alerts[0].id
    act(() => result.current.removeAlert(id))
    expect(result.current.alerts).toHaveLength(0)
  })

  test('triggers alert when price crosses threshold (above)', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.addAlert('AAPL', 'above', 185))
    act(() => result.current.updateTicker({ ...mockTicker, price: 190 }))
    expect(result.current.alerts[0].triggered).toBe(true)
    expect(result.current.notifications).toHaveLength(1)
    expect(result.current.notifications[0]).toContain('AAPL')
  })

  test('triggers alert when price crosses threshold (below)', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.addAlert('AAPL', 'below', 200))
    act(() => result.current.updateTicker({ ...mockTicker, price: 190 }))
    expect(result.current.alerts[0].triggered).toBe(true)
  })

  test('does not re-trigger already triggered alert', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.addAlert('AAPL', 'above', 185))
    act(() => result.current.updateTicker({ ...mockTicker, price: 190 }))
    act(() => result.current.updateTicker({ ...mockTicker, price: 195 }))
    expect(result.current.notifications).toHaveLength(1)
  })

  test('dismissNotification removes by index', () => {
    const { result } = renderHook(() => useTradingStore())
    act(() => result.current.addAlert('AAPL', 'above', 185))
    act(() => result.current.updateTicker({ ...mockTicker, price: 190 }))
    act(() => result.current.dismissNotification(0))
    expect(result.current.notifications).toHaveLength(0)
  })
})
