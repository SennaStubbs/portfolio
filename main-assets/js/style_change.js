// Get current date
const currentDate = new Date();

//  Winter
// Checks if the current month is inside the array of winter months
// Months go from 0-11
if ([11, 0, 1].includes(currentDate.getMonth()))
{
    document.getElementsByTagName('body')[0].classList.add('winter');
    // Updating 'page style' select menu value
    document.getElementById('style').value = 'winter';
}
//  Easter
else if (currentDate.getMonth() == 3)
{
    document.getElementsByTagName('body')[0].classList.add('easter');
    // Updating 'page style' select menu value
    document.getElementById('style').value = 'easter';
}
//  Halloween
else if (currentDate.getMonth() == 9)
{
    document.getElementsByTagName('body')[0].classList.add('spooky');
    // Updating 'page style' select menu value
    document.getElementById('style').value = 'spooky';
}
//  Birthday (May 6th)
else if (currentDate.getMonth() == 4 && currentDate.getDate() == 6)
{
    document.getElementsByTagName('body')[0].classList.add('birthday');
    // Updating 'page style' select menu value
    document.getElementById('style').value = 'birthday';
}

// Possible values for the 'page style' select menu
const pageStyles = ['winter', 'easter', 'spooky', 'birthday'];

// Listening for 'page style' select menu value being changed
document.addEventListener('input', function(event) {
    // Only run if the ID is our 'page style' select menu
    if (event.target.id != 'style') return;

    // Clearing all page styles - don't need an if statement to check for 'default' value
    document.getElementsByTagName('body')[0].classList = '';
    if (pageStyles.includes(event.target.value))
    {
        // Clearing all page styles
        document.getElementsByTagName('body')[0].classList.add(event.target.value);
    }
});

