export function handleTopic(path) {
    switch (path) {
        case 'region/umbria': return 'Umbria';
        case 'region/lazio': return 'Lazio';
        case 'region/abruzzo': return 'Abruzzo';
        case 'region/basilicata': return 'Basilicata';
        case 'region/calabria': return 'Calabria';
        case 'region/campania': return 'Campania';
        case 'region/emilia_romagna': return 'Emilia Romana';
        case 'region/friuli-venezia_giulia': return 'Friuli-Venezia Giulia';
        case 'region/Liguria': return 'Liguria';
        case 'region/Lombardia': return 'Lombardia';
        case 'region/Marche': return 'Marche';
        case 'region/Molise': return 'Molise';
        case 'region/Piemonte': return 'Piemonte';
        case 'region/puglia': return 'Puglia';
        case 'region/sardegna': return 'Sardenha';
        case 'region/sicilia': return 'Sicília';
        case 'region/toscana': return 'Toscana';
        case 'region/trentino-alto_adige': return 'Trentino-Alto Adige';
        case 'region/vale_daosta': return 'Vale DaOsta';
        case 'region/veneto': return 'Veneto';
        default: return 'Região desconhecida';
    }
}