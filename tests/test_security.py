import pytest

from app.security import validate_password_policy


def test_password_policy_accepts_strong_password():
    validate_password_policy("StrongPass#2026")


@pytest.mark.parametrize(
    "password",
    ["short", "alllowercasepassword1!", "ALLUPPERCASEPASSWORD1!", "NoNumberPassword!", "NoSymbolPassword1"],
)
def test_password_policy_rejects_weak_passwords(password):
    with pytest.raises(ValueError):
        validate_password_policy(password)
