### wp-eager

> Eager Wordpress plugin

Use this plugin to make the installation and management of [Eager](http://eager.io) even easier on Wordpress sites.

![](https://rawgithub.com/EagerIO/wp-eager/master/wp-admin/screenshot-2.png)

#### Testing (Mac OS)

1. [Set up MAMP and install Wordpress locally](http://codex.wordpress.org/Installing_WordPress_Locally_on_Your_Mac_With_MAMP)
1. Take note of the location of the folder in which you install wordpress. (For example: `/Users/username/Sites/wordpress/`.)
1. Download this repo.
1. Create a `.zip` file of the `wp-eager` folder in the root of this repo. (Name it `wp-eager.zip` if Mac OS doesn't do this for you.)
1. Visit `/wp-admin/plugin-install.php?tab=upload` and uplaod `wp-eager.zip`.
1. Activate the plugin on the installation success page.
1. To make test changes, modify the files now located in `/Users/username/Sites/wordpress/wp-content/plugins/wp-eager/`. 

Unfortunately simlinking this repo to that location did not work for me. However, at this stage, you could make this new directory your git repo and remove the one you had before. Or you can write a script or watcher for to copy the contents of your git repo to the Wordpress plugins folder copy.

#### Contributing

- If you make changes to `readme.txt`, [validate them](http://wordpress.org/plugins/about/validator/).
