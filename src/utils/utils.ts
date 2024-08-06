export function updateObject<T>(target: T, source: Partial<T>, ignoreFields: string[] = []): T {
    for (const key of Object.keys(source)) {
        if (!ignoreFields.includes(key) && source[key] !== undefined && source[key] !== null) {
            target[key] = source[key];
        }
    }
    return target;
}