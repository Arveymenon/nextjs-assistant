
const SetCustomTheme = (theme: any) => {
    console.log(theme)
    let themeColor = theme.substring(4, theme.length-1)
    document.documentElement.style.setProperty('--background', themeColor);
}

export default SetCustomTheme