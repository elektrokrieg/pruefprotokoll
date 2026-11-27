import base64, json, sys, datetime, os
V = sys.argv[1]
src = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[2]
os.makedirs(out, exist_ok=True)
b = lambda f: base64.b64encode(open(os.path.join(src,f),'rb').read()).decode()
s = open(os.path.join(src,'template.html'), encoding='utf-8').read()
s = s.replace('%%VERSION%%', V)
s = s.replace('%%LOGO_EH%%', 'data:image/jpeg;base64,'+b('eh.jpg'))
s = s.replace('%%LOGO_EK%%', 'data:image/jpeg;base64,'+b('ek.jpg'))
s = s.replace('%%FONT_R%%', b('LS-Regular.ttf')).replace('%%FONT_B%%', b('LS-Bold.ttf'))
s = s.replace('%%KUNDEN%%', open(os.path.join(src,'kunden.js'), encoding='utf-8').read())
open(os.path.join(out,'index.html'),'w',encoding='utf-8').write(s)
json.dump({'version':V,'date':datetime.date.today().isoformat()}, open(os.path.join(out,'version.json'),'w'))
sw = open(os.path.join(src,'sw.template.js')).read().replace('%%VERSION%%', V)
open(os.path.join(out,'sw.js'),'w').write(sw)
print('ok', len(s))
