export function normalizeCardSearchText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .trim()
}

export function searchValuesMatch(values, query) {
    const normalizedQuery = normalizeCardSearchText(query)

    if (!normalizedQuery)
        return true

    const compactQuery = normalizedQuery.replace(/\s+/g, '')

    return values.some(value => {
        const normalizedValue = normalizeCardSearchText(value)

        return normalizedValue.includes(normalizedQuery)
            || normalizedValue.replace(/\s+/g, '').includes(compactQuery)
    })
}

function translatedValue(value, translate) {
    if (!value)
        return ''

    return translate(value)
}

export function cardItselfMatchesSearch(card, query, translate) {
    const symbols = card.symbols || []
    const values = [
        card.name,
        translatedValue(card.name, translate),
        card.type,
        translatedValue(card.type, translate),
        ...symbols.flatMap(symbol => [symbol, translatedValue(symbol, translate)])
    ]

    return searchValuesMatch(values, query)
}

export function paramMatchesSearch(param, query, translate) {
    const values = [
        param.name,
        translatedValue(param.name, translate),
        param.symbol,
        translatedValue(param.symbol, translate)
    ]

    return searchValuesMatch(values, query)
}

export function cardMatchesSearch(card, query, translate) {
    return cardItselfMatchesSearch(card, query, translate)
        || (card.params || []).some(param => paramMatchesSearch(param, query, translate))
}
