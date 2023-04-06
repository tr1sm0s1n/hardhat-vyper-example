admin: address
struct Certificate:
    name: String[16]
    course: String[32]
    grade: String[1]
    date: String[16]
    document: Bytes[46]

event Issued:
    id: indexed(uint256)
    course: String[32]
    date: String[16]

Certificates: public(HashMap[uint256, Certificate])

@external
def __init__():
    self.admin = msg.sender

@external
def issue(_id: uint256, _name: String[16], _course: String[32], _grade: String[1], _date: String[16], _document: Bytes[46]):
    assert msg.sender == self.admin, "Not Authorized"
    self.Certificates[_id] = Certificate({ name: _name, course: _course, grade: _grade, date: _date, document: _document})
    log Issued(_id, _course, _date)