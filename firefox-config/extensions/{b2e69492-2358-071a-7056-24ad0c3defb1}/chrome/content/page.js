
function onLoad()
{
  try
  {
    var b = getBamboo();
    var page = document.getElementById('bamboo-page');
    b.ui.run('displayInTab', [page]);
  }
  catch(ex)
  {
    var error = '';
    if( ex.message != null )
    {
      error += ex.message + '\n\n';
    }
    alert('Impossible to show view. ' + error);
  }
}

function getBamboo()
{
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  var target = wm.getEnumerator("navigator:browser").getNext();
  if(!target)
  {
    target = wm.getEnumerator("mail:3pane").getNext();
  }

  return target.bamboo;
}

function display()
{
  try
  {
    var page = document.getElementById('bamboo-page');
    var b = getBamboo();

    if(!document.getElementById('bamboo-stack'))
    {
      b.ui.run('displayInTab', [page]);
    }
  }
  catch(ex)
  {
    var error = '';
    if( ex.message != null )
    {
      error += ex.message + '\n\n';
    }
    alert('Impossible to show view. ' + error);
  }
}
