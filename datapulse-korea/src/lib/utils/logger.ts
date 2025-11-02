/**
 * 환경별 로깅 유틸리티
 * 프로덕션에서는 로그를 출력하지 않음
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  error: (...args: any[]) => {
    // 에러는 프로덕션에서도 출력 (중요)
    console.error(...args)
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
}
