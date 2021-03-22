![Icon](https://bitbucket.org/code_internet_applications/code-assessment/raw/master/icon.png)
# Code Assessment v3.0.0 #
This assessment will is an example of a project we build in the past. When working on a project like this you would normally code in liquid, working with actual data, template-logic and shopify-logic but for now we will use the html-result. We like to test your knowledge on html, scss, javascript, and git as working with Shopify and liquid are things you will have to learn first.

All the source files you need are in the src folder, and will be in the dist folder after compilation. The files in the dist folder will not be committed in the GIT repository, these are only the results of your efforts.

The assessment below describes what needs to be implemented. Don't be afraid to give feedback or mention points or optimizations you come across. The goal of this assessment is to get a clear image of how you approach several challenges and how you handle those. Keep in mind that code structure, semantics and value for the client are very important for in our projects. Finishing everything is not required to pass this assessment but we would like you to finish at least assessment 1 - 6.

## Install ##
1. Clone from repository
1. $ npm install
1. $ npm run start

## Assessment ##
Please make the assessments in order as listed below. Create a new feature with your name, commit after each assessment and make a Pull Request when you're done!

**Important**: The order and content of Shopify-sections can be changed by the customer in the Customizer so the order of shopify-sections must be flexible.

1. In the shopify-section "usp-services", on mobile it should only show 1 usp per line (<768px).
1. In the shopify-section "usp-services" the icons should be rendered below the text.
1. On the homepage the heading elements (h1, h2, h3) are not in a sequentially-descending order, please fix this.
1. Do a lighthouse check on SEO for mobile and fix the issue.
1. Create a new shopify-section with a text and image pane. (See [Assessment designs](#markdown-header-assessment-designs)). Use [this](https://cdn.shopify.com/s/files/1/2396/4515/files/shopify-table-decor_2000x1000_crop_center.jpg) as image. The 2000x1000 in the url can be adjusted to render smaller images and crops.
1. The footer navigation shows to much on mobile, make it 3 collapsible panes showing only the headings. Write a simple javascript/jQuery function that will make the panes collapse and open when the heading is clicked.
1. The first shopify-section should get extra spacing on the top to show behind the header.
1. The animation of the main navigation on mobile (click the hamburger) fails when you close and open the menu quickly, please fix this.
1. The header has white text before scrolling the page. This works fine now that "hero-banner" is the first section but when the first shopify-section has a light background like "highlighted-collections", the white text in the header is unreadable. Put "highlighted-collections" as first section and add an extra class to the header that will toggle the header text black.

## Assessment designs ##
### Mobile design ###

![Mobile design](https://bitbucket.org/code_internet_applications/code-assessment/raw/master/assessment-mobile.png)

### Desktop design ###

![Desktop design](https://bitbucket.org/code_internet_applications/code-assessment/raw/master/assessment-desktop.png)

**Good luck!**