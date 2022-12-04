// Security - https://developers.google.com/web/tools/lighthouse/audits/noopener
// https://www.thesitewizard.com/html-tutorial/open-links-in-new-window-or-tab.shtml
var HTMLLinkItem = `
<li>
	<button value='%tabID%' class='delete-link btn'>delete</button>
	<a href='%url%' target='_blank' rel='noopener noreferrer'>%name%</a>
</li>
`;

var HTMLLinkItemTag = `
<span class='tooltip tag'>%tagType%
	<span class='tooltiptext tag-name'>%tagNames%</span>
</span>
`;
