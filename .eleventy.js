module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy('./src/datetime-picker.css');
    eleventyConfig.addPassthroughCopy('./src/datetime-picker.js');
    eleventyConfig.addPassthroughCopy('./src/luxon.min.js');

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}