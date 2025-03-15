export const setCookie = (res, name, value, options) => {
    res.cookie(name, value, options);
};

export const getCookie = (req, name) => {
    return req.cookies ? req.cookies[name] : null;
};
