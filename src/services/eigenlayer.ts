// src/services/eigenlayer.ts
const API_ROUTE_BASE_URL = '/api/dune';

function getFullUrl(path: string) {
    if (typeof window === 'undefined') {
        // Running on the server, use absolute URL
        return `http://localhost:3000${path}`; // Replace with your server's URL if different
    }
    // Running on the client, use relative URL
    return path;
}

async function fetchFromAPIRoute(url: string) {
    const fullUrl = getFullUrl(url);
    const response = await fetch(fullUrl);
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; 
}

export async function GetAVSStats(limit = 8, offset = 0, sortBy = 'num_operators desc') {
    // const queryParams = `avs-stats?limit=${limit}&offset=${offset}&sort_by=${encodeURIComponent(sortBy)}`; // TODO set back when pagination is fixed
    const queryParams = `3693850/results?limit=${limit}&offset=${offset}&sort_by=${encodeURIComponent(sortBy)}`;
    const url = `${API_ROUTE_BASE_URL}?url=${encodeURIComponent(queryParams)}`;
    const data = await fetchFromAPIRoute(url);
    const stats = data.result.rows;
    const nextOffset = data.next_offset;
    return { stats, nextOffset };
}

export async function GetAVSMetadata(avsAddresses: string[]) {
    const addresses = avsAddresses.map((addr: string) => `"${addr}"`).join(',');
    // const queryParams = `avs-metadata?filters=avs_contract_address in (${encodeURIComponent(addresses)})`; // TODO set back when pagination is fixed
    const queryParams = `3682939/results?filters=avs_contract_address in (${encodeURIComponent(addresses)})`;
    const url = `${API_ROUTE_BASE_URL}?url=${encodeURIComponent(queryParams)}`;
    const data = await fetchFromAPIRoute(url);
    return data.result.rows; 
}

export async function GetCombinedAVSData(limit = 8, offset = 0, sortBy = 'num_operators desc') {
    try {
        const { stats, nextOffset } = await GetAVSStats(limit, offset, sortBy);
        const avsAddresses = stats.map((stat: any) => stat.avs_contract_address);
        const metadata = await GetAVSMetadata(avsAddresses);

        const combinedData = stats.map((stat: any) => {
            const meta = metadata.find((meta: any) => meta.avs_contract_address === stat.avs_contract_address);
            return { ...meta, ...stat };
        });

        return { combinedData, nextOffset };
    } catch (error) {
        console.error('Error combining AVS data:', error);
        throw new Error('Failed to combine AVS data');
    }
}
