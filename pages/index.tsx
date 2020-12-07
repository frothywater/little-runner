import { Button, Typography } from "@material-ui/core"
import { CSSProperties } from "@material-ui/core/styles/withStyles"
import Head from "next/head"
import { generate } from "../src/functions"

const boxStyle: CSSProperties = {
  display: "flex",
  margin: "180px 20px 0px 20px",
  flexDirection: "column",
  alignItems: "center",
  flexWrap: "wrap",
}

export default function Home() {
  const handleGenerate = () => {
    const file = new Blob([generate()], { type: "application/gpx" })
    const element = document.createElement("a")
    element.setAttribute("href", URL.createObjectURL(file))
    element.setAttribute("download", `Runner-${new Date().toLocaleDateString()}.gpx`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div style={boxStyle}>
      <Head>
        <title>小跑跑</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Button
          variant="contained"
          onClick={handleGenerate}
          style={{ margin: "auto", width: 200, marginTop: 100 }}
        >
          <Typography variant="h6">跑跑</Typography>
        </Button>
      </main>

      <footer></footer>
    </div>
  )
}
