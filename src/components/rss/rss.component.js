// source: https://blog.webdevsimplified.com/2020-07/relative-time-format/
const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
})

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
]

function formatTimeAgo(date) {
  let duration = (date - new Date()) / 1000

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }
}

class RSSFeed extends Component {
  refs = { rssFeed: ".rss-feed" };
  constructor() {
    super();

    this.url = CONFIG.rss.url;
    this.client = new RssFeedClient(this.url);
    this.feed = [];
  }

  async setFeed() {
    this.feed = await this.client.getFeed();
    this.refs.rssFeed = this.renderFeed();
  }

  async template() {
    if (!this.url) return "";

    return `<div class="+ rss-feed"></div>`;
  }

  renderFeed() {
    return this.feed.map(item => this.renderFeedItem(item)).join("");
  }

  imports() {
    return [this.getResource('fonts', 'roboto')];
  }

  renderFeedItem(feedItem) {
    return `
      <article class="rss-item">
        <a target="_blank" href="${feedItem.link}">
          <img src="${feedItem.image}">
          <p>${feedItem.title}</p>
          <sub>${formatTimeAgo(feedItem.date)}</sub>
        </a>
      </article>
    `;
  }

  style() {
    return `
      .rss-feed {
        display: flex;
        gap: 15px;
        padding: 10px;
      }

      .rss-item {
        font-family: 'Roboto', sans-serif;

        a {
          text-decoration: none;
          color: ${CONFIG.palette.text};

          &:hover {
            color: ${CONFIG.palette.green};
          }
        }

        img {
          width: 210px;
          border-radius: 4px;
        }

        p {
          margin: 5px 0 0 0;
          color: ${CONFIG.palette.flamingo};

          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        sub {
          color: ${CONFIG.palette.subtext1};
        }
      }
    `;
  }

  async connectedCallback() {
    await this.render();
    await this.setFeed();
  }
}
