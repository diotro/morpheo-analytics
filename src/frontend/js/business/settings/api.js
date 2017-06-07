/* globals localStorage SERVICES_API_URL */

const getHeaders = () => ({
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
});

export const updateSettings = (id, payload) => {
    const headers = getHeaders();
    const url = `${SERVICES_API_URL}/settings/${id}/`;

    return fetch(url, {
        method: 'PATCH',
        headers,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        // credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result =>
                    Promise.reject({
                        body: new Error(result),
                        status: response.status,  // read status
                    }),
                );
            }

            return response.json();
        })
        .then(json => ({res: json}), error => ({
            error,
        }));
};

export const storeSettings = (value) => {
    localStorage.setItem('settings', value);
};

export default storeSettings;