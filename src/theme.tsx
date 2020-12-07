import { blue, pink } from "@material-ui/core/colors"
import red from "@material-ui/core/colors/red"
import { createMuiTheme } from "@material-ui/core/styles"

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: pink[300],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#000",
    },
  },
})

export default theme
