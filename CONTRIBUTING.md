### Contributing

## Development workflow

- create a branch per story (story-<storyID>/my-story-branch)
- make a pull request against the dev branch
  - improve based on feedback
  - All tests should be passing
  - Package build is successful
- once approved, your contributions will be merged into staging and included in the next release.

## [Definition of done](https://trello.com/c/Bwr9ltza)

- feature is responsive
- unit test passing
- reviewed by PO + one other team member

- approved PR merges the story branch in staging
- code is reviewed before pushing to "dev" environment
- document every feature in [our Gitbook ](https://app.gitbook.com/o/-MfiuY33tsDX7Su0127P/s/VMEQ8pOelLAC9Dz9eqbW/overview)

## Creating a new package

npx lerna create @discovery-dao/<new-package>

## Publishing a package

npx lerna publish
