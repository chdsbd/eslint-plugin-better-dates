import * as ts from 'typescript'
import * as util from '../util'

export type MessageIds = 'banDateMutation'

const disallowedDateMethods = new Set([
  'setDate',
  'setFullYear',
  'setHours',
  'setMilliseconds',
  'setMinutes',
  'setMonth',
  'setSeconds',
  'setTime',
  'setUTCDate',
  'setUTCFullYear',
  'setUTCHours',
  'setUTCMilliseconds',
  'setUTCMinutes',
  'setUTCMonth',
  'setUTCSeconds',
  'setYear',
])

const methodToDateFns: Record<string, string | null> = {
  setDate: 'setDate',
  setFullYear: '{setYear,setMonth,setDate}',
  setHours: '{setHours,setMinutes,setSeconds,setMilliseconds}',
  setMilliseconds: 'setMilliseconds',
  setMinutes: 'setMinutes',
  setMonth: 'setMonth',
  setSeconds: 'setSeconds',
  setTime: 'fromUnixTime',
  setUTCDate: null,
  setUTCFullYear: null,
  setUTCHours: null,
  setUTCMilliseconds: null,
  setUTCMinutes: null,
  setUTCMonth: null,
  setUTCSeconds: null,
  setYear: 'setYear',
}

function formatSuggestion(
  methodName: string,
  suggestion: string | null
): string {
  if (suggestion === null) {
    return ''
  }
  return ` Replace \`Date.${methodName}\` with \`date-fns/${suggestion}\``
}

function isDate(symbol: ts.Symbol, typeChecker: ts.TypeChecker): boolean {
  return (
    typeChecker.typeToString(
      typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
    ) === 'DateConstructor'
  )
}

export default util.createRule<[], MessageIds>({
  name: 'ban-date-mutation',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Bans mutating Date objects',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      banDateMutation: "Don't mutate a Date with `{{method}}`.{{suggestion}}",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MemberExpression(node): void {
        const parserServices = util.getParserServices(context)
        const typeChecker = parserServices.program.getTypeChecker()
        const objectType = typeChecker
          .getTypeAtLocation(
            parserServices.esTreeNodeToTSNodeMap.get(node.object)
          )
          .getSymbol()
        if (objectType != null && isDate(objectType, typeChecker)) {
          const dateMethod = typeChecker
            .getTypeAtLocation(
              parserServices.esTreeNodeToTSNodeMap.get(node.property)
            )
            .getSymbol()
            ?.getEscapedName()
          if (dateMethod == null) {
            return
          }
          const dateMethodString = dateMethod.toString()
          if (disallowedDateMethods.has(dateMethodString)) {
            context.report({
              node,
              data: {
                method: dateMethod,
                suggestion: formatSuggestion(
                  dateMethodString,
                  methodToDateFns[dateMethodString]
                ),
              },
              messageId: 'banDateMutation',
            })
          }
        }
      },
    }
  },
})
