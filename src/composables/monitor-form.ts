import { z } from 'zod'
const IGNORE_MARK = 'spIgnoreForm'

const emailSchema = z.string().email()

function isEmail(str: string) {
  return emailSchema.safeParse(str).success
}

export function useMonitorFormSubmit(onSubmit: (email: string) => void) {
  useEventListener(
    document,
    'submit',
    (event) => {
      if (event.target instanceof HTMLFormElement) {
        if (Object.hasOwn(event.target.dataset, IGNORE_MARK)) {
          return
        }

        const formData = new FormData(event.target)
        const emails: string[] = []
        for (const value of formData.values()) {
          /* v8 ignore next 3 */
          if (typeof value !== 'string' || !value) {
            return
          }

          if (isEmail(value)) {
            emails.push(value)
          }
        }

        if (emails.length === 1) {
          onSubmit(emails[0])
        }
      }
    },
    { capture: true },
  )
}
