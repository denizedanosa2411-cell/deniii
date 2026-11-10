import {use} from 'react';

export function TipOfDay({ tipPromise}) {
    const tip = use(tipPromise);
    return <p className = "muted">🌟{tip}</p>;
}