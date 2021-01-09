module.exports = function (api) {
    api.cache(true);
    // See: 
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        '$screens': "./screens",
                        '$styles': "./styles",
                        '$components': "./components",
                        '$lib': "./lib",
                        '$assets': "./assets"
                    },
                },
            ],
        ]
    };
};
