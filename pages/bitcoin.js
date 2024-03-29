import { withScreenSize } from '@vx/responsive'
import { LinearGradient } from '@vx/gradient'
import Chart from '../components/chart'
import formatPrice from '../utils/formatPrice'

const Background = ({ width, height }) => {
  return (
    <svg
      width={width}
      height={height}
    >
      <LinearGradient id="fill" vertical={false}>
        <stop stopColor="#a943e4" offset="0%" />
        <stop stopColor="#f55989" offset="50%" />
        <stop stopColor="#ffaf84" offset="100%" />
      </LinearGradient>
      <rect width={width} height={height} fill="url(#fill)"/>
    </svg>
  )
}

class App extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      data: {}
    }
  }
  componentDidMount () {
    fetch('https://api.coindesk.com/v1/bpi/historical/close.json')
    .then(res => res.json())
    .then(json => {
      console.log(json)
      this.setState({
        data: json
      })
    })
  }
  render () {
    const { screenWidth, screenHeight } = this.props
    const { data } = this.state

    if(!data.bpi) {
      return <div>Loading...</div>
    }

    // Reformat data.bpi to an object with separate date and price
    const prices = Object.keys(data.bpi).map(key => {
      return {
        date: key,
        price: data.bpi[key]
      }
    })

    // Get the price of the last item in “prices” array
    const currentPrice = prices[prices.length - 1].price
    const firstPrice = prices[0].price
    const diffPrice = currentPrice - firstPrice
    const hasIncreased = diffPrice > 0

    return (
      <div className="app">
        <Background width={screenWidth} height={screenHeight}/>
        <div className="page">
          <div className="content">
            <div className="titlebar">
              <div className="title">
                <div>Bitcoin Price, USD</div>
                <div><small>Last 30 days</small></div>
              </div>
              <div className="prices">
                <div>{formatPrice(currentPrice)}</div>
                <div className={hasIncreased ? 'increased': 'decreased'}><small>
                  {hasIncreased ? "▴ " : "▾ "}
                  {formatPrice(diffPrice)}
                </small></div>
              </div>
            </div>
            <div className="chart-container">
              <Chart data={prices} ></Chart>
            </div>
          </div>
          <p className="disclaimer">
            {data.disclaimer}
          </p>
        </div>
        <style jsx>{`
          .app, .page {
            display: flex;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            justify-content: center;
            align-items: center;
            font-family: Arial;
            flex-direction: column;
          }
          .titlebar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
          }
          .prices {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .increased {
            color: #00F1A1;
          }
          .decreased {
            color: #FE5F55;
          }
          .chart-container {
            flex: 1;
            display: flex;
          }
          .content {
            display: flex;
            flex-direction: column;
            width: 600px;
            height: 400px;
            background-color: #27273f;
            border-radius: 8px;
            color: white;
          }
          .disclaimer {
            color: white;
            opacity: 0.4;
            font-size: 11px;
          }
        `}</style>
      </div>
    )
  }
}

export default withScreenSize(App)
