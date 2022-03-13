import React, { useContext, useRef } from 'react';
import TooltipContent from './TooltipContent';
import styled, { ThemeContext } from 'styled-components';
import { Tooltip } from '../../models';
import useMobile from '../../hooks/useMobile';

// import 'tippy.js/dist/tippy.css';
// import 'tippy.js/animations/shift-away.css';
import { SkillTheme } from 'theme';

interface Props {
  children: React.ReactElement;
  title: string;
  tooltip: Tooltip;
}

function Tooltip(props: Props) {
  const { children, tooltip, title } = props;
  const { direction = 'top', content } = tooltip;
  const { tooltipZIndex } = useContext<SkillTheme>(ThemeContext);
  const isMobile = useMobile();

  const placement = React.useMemo(() => (isMobile ? 'top' : direction), [
    isMobile,
    direction,
  ]);

  return <>{children}</>;
}

export default Tooltip;
