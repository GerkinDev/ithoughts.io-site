// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	showroom: [
		{
			name: 'iThoughts',
			tech: 'Angular2',
			siteurl: 'https://ithoughts.io',
			descFr: 'Site corporate responsive avec Angular2 & Diaspora.',
		},
		{
			name: 'Self 3D Print',
			tech: 'Symfony4',
			siteurl: 'https://self3dprint.ithoughts.io',
			descFr: 'Vente en ligne d\'objets imprimés en 3D, où les utilisateurs peuvent imprimer leurs propres modèles. En développement.',
		},
		{
			name: 'GerkinDevelopment',
			tech: 'Wordpress',
			siteurl: 'https://www.gerkindevelopment.net',
			descFr: 'Blog d\'Alexandre Germain, basé sur un WordPress lourdement personnalisé.',
		},
		{
			name: 'Art Aux Murs',
			tech: 'Prestashop',
			siteurl: 'https://www.art-aux-murs.fr/',
			descFr: 'Vente en ligne de tableaux de fractales ou abstraits.'
		}
	],
};
