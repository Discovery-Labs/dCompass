import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  SkillTreeGroup,
  SkillProvider,
  SkillTree,
  SkillType,
  SkillGroupDataType,
} from '../index';
import defaultTheme, { SkillTheme } from '../theme';
import mockTheme from '../__mocks__/mockTheme';
import MockLocalStorage from '../__mocks__/mockLocalStorage';

const simpleData: SkillType[] = [
  {
    id: 'html',
    title: 'html',
    tooltip: {
      content: 'the method of structuring websites',
    },
    icon: '../',
    children: [
      {
        id: 'css',
        title: 'css',
        tooltip: {
          content:
            "Lilith's Action Skill is Phasewalk, which allows her to turn invisible and increase her running speed. Upon entering and exiting Phasewalk, Lilith releases a Phase Blast that damages enemies around her. While in Phasewalk, Lilith cannot shoot, jump, or collect loot, and a melee attack will cause her to exit Phasewalk.",
        },
        children: [
          {
            id: 'javascript-basics',
            color: 'alternative',
            title: 'javascript basics',
            tooltip: {
              content: 'adding interactivity',
            },
            children: [],
          },
        ],
      },
    ],
  },
];

const simpleDataTwo: SkillType[] = [
  {
    id: 'hidden-by-default',
    title: 'hidden',
    tooltip: {
      content: 'all the props',
    },
    children: [],
  },
];

const simpleDataThree: SkillType[] = [
  {
    id: 'lockable',
    title: 'lockable',
    tooltip: {
      content: 'all the props',
    },
    children: [],
  },
];

const complexData: SkillType[] = [
  {
    id: 'languages',
    title: 'languages',
    tooltip: {
      content: 'used as the building blocks for creating amazing projects',
    },

    icon: '../',
    children: [
      {
        id: 'python',
        title: 'python',
        tooltip: {
          content: 'used as the building blocks for creating amazing projects',
        },
        children: [],
      },
      {
        id: 'javascript',
        title: 'javascript',
        tooltip: {
          content: 'used as the building blocks for creating amazing projects',
        },
        children: [
          {
            id: 'typescript',
            title: 'typescript',
            tooltip: {
              content:
                'used as the building blocks for creating amazing projects',
            },
            children: [],
          },
          {
            id: 'nodejs',
            title: 'nodejs',
            tooltip: {
              content:
                'used as the building blocks for creating amazing projects',
            },
            children: [],
          },
        ],
      },
      {
        id: 'golang',
        title: 'golang',
        tooltip: {
          content: 'used as the building blocks for creating amazing projects',
        },
        children: [],
      },
    ],
  },
  {
    id: 'paradigms',
    title: 'OOP',
    tooltip: {
      content: 'used as the building blocks for creating amazing projects',
    },
    children: [],
  },
];

const optionalNodeData: SkillType[] = [
  {
    id: 'html-req',
    title: 'html',
    tooltip: {
      content: 'the method of structuring websites',
    },
    icon: '../',
    children: [
      {
        id: 'css-opt',
        title: 'css',
        optional: true,
        tooltip: {
          content:
            "Lilith's Action Skill is Phasewalk, which allows her to turn invisible and increase her running speed. Upon entering and exiting Phasewalk, Lilith releases a Phase Blast that damages enemies around her. While in Phasewalk, Lilith cannot shoot, jump, or collect loot, and a melee attack will cause her to exit Phasewalk.",
        },
        children: [
          {
            id: 'javascript-basics-req',
            title: 'javascript basics',
            tooltip: {
              content: 'adding interactivity',
            },
            children: [],
          },
        ],
      },
    ],
  },
];

function LockedSkillTree() {
  const [isDisabled, setDisabledState] = useState(true);

  return (
    <div>
      <button onClick={() => setDisabledState(!isDisabled)}>
        Toggle Disability
      </button>
      <SkillTree
        treeId="fourth"
        title="Lockable by default"
        data={simpleDataThree}
        disabled={isDisabled}
      />
    </div>
  );
}

function renderComponent(
  secondarySkillTree: SkillType[],
  theme: Partial<SkillTheme> = defaultTheme
) {
  const skillTreeTheme = { ...defaultTheme, ...theme };

  return render(
    <SkillProvider>
      <SkillTreeGroup theme={skillTreeTheme}>
        {({
          skillCount,
          selectedSkillCount,
          resetSkills,
          handleFilter,
        }: SkillGroupDataType) => {
          const totalSkillCount = skillCount.required + skillCount.optional;
          const totalSelectedSkillCount =
            selectedSkillCount.optional + selectedSkillCount.required;
          return (
            <React.Fragment>
              <h2 className="Example__heading">
                Completed skills:
                <span data-testid="selected-count">
                  {totalSelectedSkillCount}
                </span>
                /<span data-testid="total-count">{totalSkillCount}</span>
                <button data-testid="reset-button" onClick={resetSkills}>
                  Reset
                </button>
                <input
                  placeholder="filter"
                  onChange={({ target }) => handleFilter(target.value)}
                />
              </h2>
              <SkillTree treeId="fe" title="Frontend" data={simpleData} />
              <SkillTree
                treeId="be"
                title="Backend"
                closedByDefault={false}
                data={secondarySkillTree}
              />
              <SkillTree
                treeId="third"
                title="Hidden by default"
                data={simpleDataTwo}
                closedByDefault
              />
              <LockedSkillTree />
            </React.Fragment>
          );
        }}
      </SkillTreeGroup>
    </SkillProvider>
  );
}

afterEach(() => {
  window.localStorage.setItem('skills-be', JSON.stringify({}));
  window.localStorage.setItem('skills-fe', JSON.stringify({}));
});

beforeAll(() => {
  //@ts-ignore
  window.localStorage = new MockLocalStorage();
});

describe('SkillTreeGroup component', () => {
  describe('simple data structure', () => {
    it('should render a simple tree', () => {
      const { queryByText, getByTestId } = renderComponent([]);

      expect(queryByText('Frontend')).toBeTruthy();
      expect(queryByText('Backend')).toBeTruthy();

      expect(getByTestId('selected-count')).toHaveTextContent('0');
      expect(getByTestId('total-count')).toHaveTextContent('5');

      expect(getByTestId('html')).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(getByTestId('css')).toHaveStyleRule('opacity', '0.65');
      expect(getByTestId('javascript-basics')).toHaveStyleRule(
        'opacity',
        '0.65'
      );
    });

    it('should handle sequential clicking of the nodes', () => {
      const { getByTestId } = renderComponent([]);

      const htmlNode = getByTestId('html');
      const cssNode = getByTestId('css');
      const jsNode = getByTestId('javascript-basics');

      expect(htmlNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(cssNode).toHaveStyleRule('opacity', '0.65');
      expect(jsNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(htmlNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(jsNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(cssNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule('background', /linear-gradient/);
      expect(jsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );

      fireEvent.click(jsNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule('background', /linear-gradient/);
      expect(jsNode).toHaveStyleRule('background', /linear-gradient/);

      fireEvent.click(jsNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule('background', /linear-gradient/);
      expect(jsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );

      fireEvent.click(cssNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(jsNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(htmlNode);

      expect(htmlNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(cssNode).toHaveStyleRule('opacity', '0.65');
      expect(jsNode).toHaveStyleRule('opacity', '0.65');
    });

    it('should deselect all child nodes when then parent is deselected', () => {
      const { getByTestId } = renderComponent([]);

      const htmlNode = getByTestId('html');
      const cssNode = getByTestId('css');
      const jsNode = getByTestId('javascript-basics');

      expect(htmlNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(cssNode).toHaveStyleRule('opacity', '0.65');
      expect(jsNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(htmlNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(jsNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(cssNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule('background', /linear-gradient/);
      expect(jsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );

      fireEvent.click(htmlNode);

      expect(htmlNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(cssNode).toHaveStyleRule('opacity', '0.65');
      expect(jsNode).toHaveStyleRule('opacity', '0.65');
    });

    it('should display the correct counter on sequential node selection ', () => {
      const { getByTestId } = renderComponent([]);

      const htmlNode = getByTestId('html');
      const cssNode = getByTestId('css');

      const selectedCount = getByTestId('selected-count');
      const totalCount = getByTestId('total-count');

      expect(selectedCount).toHaveTextContent('0');
      expect(totalCount).toHaveTextContent('5');

      fireEvent.click(htmlNode);

      expect(selectedCount).toHaveTextContent('1');
      expect(totalCount).toHaveTextContent('5');

      fireEvent.click(cssNode);

      expect(selectedCount).toHaveTextContent('2');
      expect(totalCount).toHaveTextContent('5');

      fireEvent.click(cssNode);

      expect(selectedCount).toHaveTextContent('1');
      expect(totalCount).toHaveTextContent('5');
    });

    it('should not select a locked node', () => {
      const { getByTestId } = renderComponent([]);

      const jsNode = getByTestId('javascript-basics');
      const selectedCount = getByTestId('selected-count');

      expect(selectedCount).toHaveTextContent('0');

      expect(jsNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(jsNode);

      expect(selectedCount).toHaveTextContent('0');
      expect(jsNode).toHaveStyleRule('opacity', '0.65');
    });

    it('should reset the counter when the top node is selected', () => {
      const { getByTestId } = renderComponent([]);

      const htmlNode = getByTestId('html');
      const cssNode = getByTestId('css');
      const jsNode = getByTestId('javascript-basics');

      const selectedCount = getByTestId('selected-count');

      expect(selectedCount).toHaveTextContent('0');

      fireEvent.click(htmlNode);
      fireEvent.click(cssNode);
      fireEvent.click(jsNode);

      expect(selectedCount).toHaveTextContent('3');

      fireEvent.click(htmlNode);

      expect(selectedCount).toHaveTextContent('0');
    });

    it('should reset the counter and the nodes when the reset button is clicked', () => {
      const { getByTestId } = renderComponent([]);

      const htmlNode = getByTestId('html');
      const cssNode = getByTestId('css');
      const jsNode = getByTestId('javascript-basics');

      const selectedCount = getByTestId('selected-count');
      const resetButton = getByTestId('reset-button');

      expect(selectedCount).toHaveTextContent('0');

      fireEvent.click(htmlNode);
      fireEvent.click(cssNode);
      fireEvent.click(jsNode);

      expect(selectedCount).toHaveTextContent('3');

      fireEvent.click(resetButton);

      expect(selectedCount).toHaveTextContent('0');

      expect(htmlNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(cssNode).toHaveStyleRule('opacity', '0.65');
      expect(jsNode).toHaveStyleRule('opacity', '0.65');
    });
  });

  describe('complex data structure', () => {
    it('should render a complex tree', () => {
      const { queryByText, getByTestId } = renderComponent(complexData);

      expect(queryByText('Frontend')).toBeTruthy();
      expect(queryByText('Backend')).toBeTruthy();

      expect(getByTestId('selected-count')).toHaveTextContent('0');
      expect(getByTestId('total-count')).toHaveTextContent('12');

      expect(getByTestId('languages')).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(getByTestId('python')).toHaveStyleRule('opacity', '0.65');
      expect(getByTestId('javascript')).toHaveStyleRule('opacity', '0.65');
      expect(getByTestId('nodejs')).toHaveStyleRule('opacity', '0.65');
      expect(getByTestId('typescript')).toHaveStyleRule('opacity', '0.65');
      expect(getByTestId('golang')).toHaveStyleRule('opacity', '0.65');
    });

    it('should correctly handle optional nodes', () => {
      const { getByTestId } = renderComponent(optionalNodeData);

      const htmlNode = getByTestId('html-req');
      const cssNode = getByTestId('css-opt');
      const jsNode = getByTestId('javascript-basics-req');

      fireEvent.click(htmlNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(jsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );

      fireEvent.click(jsNode);

      expect(htmlNode).toHaveStyleRule('background', /linear-gradient/);
      expect(cssNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(jsNode).toHaveStyleRule('background', /linear-gradient/);
    });

    it('should display the correct states of branched nodes', () => {
      const { getByTestId } = renderComponent(complexData);

      expect(getByTestId('selected-count')).toHaveTextContent('0');

      const languageNode = getByTestId('languages');
      const jsNode = getByTestId('javascript');
      const tsNode = getByTestId('typescript');
      const nodeNode = getByTestId('nodejs');

      fireEvent.click(languageNode);

      expect(jsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(tsNode).toHaveStyleRule('opacity', '0.65');
      expect(nodeNode).toHaveStyleRule('opacity', '0.65');

      fireEvent.click(jsNode);

      expect(jsNode).toHaveStyleRule('background', /linear-gradient/);
      expect(tsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(nodeNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );

      fireEvent.click(tsNode);

      expect(jsNode).toHaveStyleRule('background', /linear-gradient/);
      expect(tsNode).toHaveStyleRule('background', /linear-gradient/);
      expect(nodeNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );

      fireEvent.click(jsNode);

      expect(jsNode).toHaveStyleRule(
        'box-shadow',
        '0 0 6px 0 rgba(255,255,255,0.5)'
      );
      expect(tsNode).toHaveStyleRule('opacity', '0.65');
      expect(nodeNode).toHaveStyleRule('opacity', '0.65');
    });
  });

  describe('custom themes', () => {
    it('should change the appearance of the components', () => {
      const { getByTestId } = renderComponent([], mockTheme);
      const htmlNode = getByTestId('html');

      expect(htmlNode).toHaveStyleRule('background', 'grey');
    });

    it('should correctly display the alternative components', () => {
      const { getByTestId, getByText } = renderComponent([], mockTheme);
      const javascriptNode = getByTestId('javascript-basics');
      const javascriptText = getByText('javascript basics');

      expect(javascriptNode).toHaveStyleRule('background', 'grey');
      expect(javascriptText).toHaveStyleRule('color', '#F7B538');

      fireEvent.click(getByTestId('html'));
      fireEvent.click(getByTestId('css'));
      fireEvent.click(javascriptNode);

      expect(javascriptNode).toHaveStyleRule('background', 'blue');
      expect(javascriptText).toHaveStyleRule('color', 'white');
    });
  });

  describe('filtering', () => {
    it('should display the tree when no query has been made', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent([]);

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainer] = getAllByTestId('visibility-container');

      expect(visibilityContainer).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: 'ppppa',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 0');
    });

    it('should not display the tree by default when the correct prop is passed through', () => {
      const { queryAllByTestId } = renderComponent([]);

      const [, , visibilityContainer] = queryAllByTestId(
        'visibility-container'
      );

      expect(visibilityContainer).toBeFalsy();
    });

    it('should display the tree if the query contains a matching skillid', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent([]);

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainer] = getAllByTestId('visibility-container');

      expect(visibilityContainer).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: 'java',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 1');
    });

    it('should display the tree if no valid query is present', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent([]);

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainer] = getAllByTestId('visibility-container');

      expect(visibilityContainer).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: null,
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 1');
    });

    it('should not display the tree if the query does not contain a matching skillid', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent([]);

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainer] = getAllByTestId('visibility-container');

      expect(visibilityContainer).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: 'javascrooo',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 0');
    });

    it('should cause a tree to hide/show when the filter query changes', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent([]);

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainer] = getAllByTestId('visibility-container');

      expect(visibilityContainer).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: 'javascrooo',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 0');

      fireEvent.change(filterInput, {
        target: {
          value: 'javascroo',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 0');

      fireEvent.change(filterInput, {
        target: {
          value: 'java',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: 'javajava',
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 0');

      fireEvent.change(filterInput, {
        target: {
          value: null,
        },
      });

      expect(visibilityContainer).toHaveStyle('opacity: 1');
    });

    it('should only display the trees that contain skillIds that match the filter query', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent(
        complexData
      );

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainerOne, visibilityContainerTwo] = getAllByTestId(
        'visibility-container'
      );

      expect(visibilityContainerOne).toHaveStyle('opacity: 1');
      expect(visibilityContainerTwo).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: 'css',
        },
      });

      expect(visibilityContainerOne).toHaveStyle('opacity: 1');
      expect(visibilityContainerTwo).toHaveStyle('opacity: 0');
    });

    it('should display the trees when the filter query contains only spaces', () => {
      const { getByPlaceholderText, getAllByTestId } = renderComponent([]);

      const filterInput = getByPlaceholderText('filter');
      const [visibilityContainerOne] = getAllByTestId('visibility-container');

      expect(visibilityContainerOne).toHaveStyle('opacity: 1');

      fireEvent.change(filterInput, {
        target: {
          value: '      ',
        },
      });

      expect(visibilityContainerOne).toHaveStyle('opacity: 1');
    });
  });

  describe('disabled skill trees', () => {
    it('should not have their contents visible', () => {
      const { getByText, queryByText } = renderComponent([]);

      const lockedTree = getByText('Lockable by default');

      fireEvent.click(lockedTree);

      expect(queryByText('lockable')).toBeNull();
    });

    it('should be interactive only if it is no longer disabled', () => {
      const { getByText, queryByText } = renderComponent([]);

      const lockedTree = getByText('Lockable by default');
      const lockButton = getByText('Toggle Disability');

      fireEvent.pointerDown(lockedTree);

      expect(queryByText('lockable')).toBeNull();

      fireEvent.click(lockButton);
      fireEvent.pointerDown(lockedTree);

      expect(queryByText('lockable')).toBeTruthy();
    });

    it('should not respond to a filter input match ', () => {
      const { getByPlaceholderText, queryByText, getByText } = renderComponent(
        []
      );

      const filterInput = getByPlaceholderText('filter');
      const lockButton = getByText('Toggle Disability');

      fireEvent.change(filterInput, {
        target: {
          value: 'lockable',
        },
      });

      expect(queryByText('lockable')).toBeNull();

      fireEvent.click(lockButton);

      fireEvent.change(filterInput, {
        target: {
          value: '',
        },
      });

      fireEvent.change(filterInput, {
        target: {
          value: 'lockable',
        },
      });

      expect(queryByText('lockable')).toBeTruthy();
    });
  });
});
