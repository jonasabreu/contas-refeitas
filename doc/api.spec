API

/ -> root
 * total

/subfuncao
	{ 'item': total, ... }
/natureza
	{ 'item': total, ... }
/destino 
	{ 'item': total, ... }
	
/subfuncao/natureza/10
	{ 'item': [total, { 'natureza': total } ], ... }
	
/subfuncao/natureza/destino
	{ 'item': [total, { 'natureza': [total, { 'destino': total ] } ], ... }