var React = require("react");
var PropTypes = require("prop-types");
import { fetchPopularRepos } from "../utils/api";
import {
  FaUser,
  FaStar,
  FaCodeBranch,
  FaExclamationTriangle
} from "react-icons/fa";
import Card from "./Card";
import Loading from './Loading'
import Tooltip from './Tooltip'


function LanguagesNav({ selected, onUpdeteLanguage }) {
  const languages = ["All", "JS", "Ruby", "Java", "CSS", "Python"];
  return (
    <ul className="flex-center">
      {languages.map(lang => (
        <li key={lang}>
          <button
            onClick={() => onUpdeteLanguage(lang)}
            style={lang === selected ? { color: "rgb(184,46,31)" } : null}
            className="btn-clear nav-link"
          >
            {lang}
          </button>
        </li>
      ))}
    </ul>
  );
}
LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdeteLanguage: PropTypes.func.isRequired
};

function ReposGrid({ repos }) {
  return (
    <ul className="grid space-around">
      {repos.map((repo, index) => {
        const {
          name,
          owner,
          html_url,
          stargazers_count,
          forks,
          open_issues
        } = repo;
        const { login, avatar_url } = owner;

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className="card-list">
                <li>
								<Tooltip text='Git username'>
                  <FaUser color="rgb(255, 191, 116)" size={22} />
                  <a href={`https://github.com/${login}`}>{login}</a>
									</Tooltip>
                </li>
                <li>
                  <FaStar color="rgb(255,215,0)" size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color="rgb(129,195,245)" size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color="rgb(241,138,145)" size={22} />
                  {open_issues.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
};

export default class Popular extends React.Component {
	state = {
		selectedLanguage: "All",
		repos: {},
		error: null
	};
 
  componentDidMount() {
    this.updeteLanguage(this.state.selectedLanguage);
  }
  updeteLanguage = (selectedLanguage) => {
    this.setState({
      selectedLanguage,
      error: null
    });

    if (!this.state.repos[selectedLanguage]) {
      fetchPopularRepos(selectedLanguage)
        .then(data => {
          this.setState(({ repos }) => ({
            repos: {
              ...repos,
              [selectedLanguage]: data
            }
          }));
        })
        .catch(() => {
          console.warn("Error fetching repos: ", error);
          this.setState({
            error: `there was an error fetching the repositories`
          });
        });
    }
  }
  isLoading = () => {
    const { selectedLanguage, repos, error } = this.state;
    return !repos[selectedLanguage] && error === null;
  }

  render() {
    const { selectedLanguage, repos, error } = this.state;
    return (
      <React.Fragment>
        <LanguagesNav
          selected={selectedLanguage}
          onUpdeteLanguage={this.updeteLanguage}
        />
        {this.isLoading() && <Loading text={'Fetching repos'}/>}
        {error && <p className="center-text error">{error}</p>}
        {repos[selectedLanguage] && (
          <ReposGrid repos={repos[selectedLanguage]} />
        )}
      </React.Fragment>
    );
  }
}
